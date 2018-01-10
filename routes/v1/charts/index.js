const charts = require('express').Router();
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const groupArray = require('group-array');
const AWS = require('aws-sdk');

// Setup AWS
AWS.config.loadFromPath('./config/aws_config.json');
var s3 = new AWS.S3();

let getBucketCount = function(chart, params) {
    return new Promise((resolve, reject) => {
        s3.listObjectsV2(params, function(err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else if (data && data.KeyCount)
                return resolve({ chart, keyCount: data.KeyCount});
            else
                return resolve({ chart, keyCount: 0});
        });   
    });
};

charts.get('/', (req, res) => {
    let filepath = path.join(__basedir, 'config', 'settings.json');

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err)
            res.json('{}');
        else
        {
            var settings = JSON.parse(data);

            settings.rows.forEach(row => {
                if (row.charts.length <= 12)
                    row.colSize = 12 / row.charts.length;
                else
                    row.colSize = 1;
            });

            res.json(settings);
        }
    });
});

charts.get('/:chartid/:timerange', (req, res) => {
    let chartid = req.params.chartid;
    let timerange = req.params.timerange;
    let filepath = path.join(__basedir, 'chart_data', `${chartid}.json`);
    let dataDefault = { columns: [], rows: [] };

    fs.exists(filepath, exists => {
        if (exists) {
            fs.readFile(filepath, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    res.json(dataDefault);
                }
        
                let chartData = JSON.parse(data);
        
                res.send(chartData);
            });
        } else {
            res.json(dataDefault);
        }
    });
});

charts.delete('/', (req, res) => {
    fs.readdir(path.join(__basedir, 'chart_data'), 'utf8', (err, files) => {
        if (err) {
            console.log(err);
            res.end();
        } else {
            files.forEach(file => {
                fs.unlink(path.join(__basedir, 'chart_data', file), err => {
                    if (err) console.log(err);
                });
            });

            res.end();
        }
    });
});

charts.post('/getcounts', (req, res) => {
    // Make a bucket count request for this timestamp
    let date = moment().format('YYYYMMDDHHmm');
    
    // Make the request for all Charts in settings.
    fs.readFile('./config/settings.json', 'utf8', (readSettingsErr, settingsData) => {
        if (readSettingsErr) console.log(readSettingsErr);

        var settings = JSON.parse(settingsData);

        // Create a promise to pull data for each Chart
        let promises = [];
        settings.rows.forEach(row => {
            row.charts.forEach(chart => {
                // Chart can have multiple buckets
                let buckets = chart.buckets.split(',');

                buckets.forEach(bucket => {
                    promises.push(getBucketCount(chart, { Bucket: bucket, Prefix: chart.prefix }));
                });
            });
        });
            
        // Execute the bucket count requests. Responses come back in same order requested.
        Promise
            .all(promises)
            .then(apiResponses => {
                // Group the results by chart
                let groupedResponses = groupArray(apiResponses, 'chart.uuid');

                for (var property in groupedResponses) {
                    if (groupedResponses.hasOwnProperty(property)) {
                        let group = groupedResponses[property];
                        let chart = group[0].chart;
                        let buckets = chart.buckets.split(',');
                        let row = { date };

                        for (let i=0; i < buckets.length; i++) {
                            row[buckets[i]] = group[i].keyCount;
                        }

                        let filePath = path.join(__basedir, 'chart_data', `${chart.uuid}.json`);

                        fs.exists(filePath, exists => {
                            if (exists) {
                                fs.readFile(filePath, 'utf8', (readChartErr, chartDataRaw) => {
                                    if (readChartErr) {
                                        console.log(readChartErr);
                                        res.end();
                                    }
                            
                                    let chartData = JSON.parse(chartDataRaw);
                                    chartData.rows.push(row);
        
                                    fs.writeFile(filePath, JSON.stringify(chartData), 'utf8', writeChartErr => {
                                        if (writeChartErr) console.log(writeChartErr);
                                        res.end();
                                    });
                                });
                            } else {
                                let buckets = chart.buckets.split(',');
                                let chartData= { columns: ['date'].concat(buckets), rows: [row] };

                                fs.writeFile(filePath, JSON.stringify(chartData), 'utf8', writeChartErr => {
                                    if (writeChartErr) console.log(writeChartErr);
                                    res.end();
                                });
                            }
                        });
                    }
                }
            })
            .catch(reason => {
                console.log(reason);
                res.end();
            });
    });
});

module.exports = charts;