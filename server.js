const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const mkdirp = require('mkdirp');
const uuidv4 = require('uuid/v4');
const groupArray = require('group-array');

// Setup express
let app = express();

// Figure out which port
const PORT = process.env.PORT || 3000;

// Setup body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Setup ability to serve static content
app.use(express.static('public'));

// Setup AWS
AWS.config.loadFromPath('./config/aws_config.json');
var s3 = new AWS.S3();

// Functions to get data from S3
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

// let getFileNames = function(params) {
//     return new Promise((resolve, reject) => {
//         s3.listObjectsV2(params, function(err, data) {
//             let response = {
//                 bucket: params.Bucket,
//                 prefix: params.Prefix,
//                 files: []
//             };

//             if (err) {
//                 console.log(err);
//                 resolve(response);
//             } else if (data && data.Contents && data.Contents.length > 0) {
//                 response.files = data.Contents.map(file => `https://s3.console.aws.amazon.com/s3/object/${data.Name}/${file.Key}`);
//                 return resolve(response);
//             }
//             else
//                 return resolve(response);
//         });   
//     });
// };

app.get('/api/settings', (req, res) => {
    let filepath = path.join(__dirname, 'config', 'settings.json');

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err)
            res.json('{}');
        else
            res.json(JSON.parse(data));
    });
});

app.get('/api/charts', (req, res) => {
    let filepath = path.join(__dirname, 'config', 'settings.json');

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

app.get('/api/chart/:chartid/:timerange', (req, res) => {
    let chartid = req.params.chartid;
    let timerange = req.params.timerange;
    let filepath = path.join(__dirname, 'chart_data', `${chartid}.json`);
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

app.post('/api/settings', (req, res) => {
    let dir = path.join(__dirname, 'config');
    let settings = req.body;

    // Make sure every entity has a unique ID and data file.
    settings.rows.forEach(row => {
        if (row.uuid == undefined)
            row.uuid = uuidv4();

        row.charts.forEach(chart => {
            if (chart.uuid == undefined) {
                chart.uuid = uuidv4();

                // Create a matching data file for this chart.
                let buckets = chart.buckets.split(',');
                let data = { columns: ['date'].concat(buckets), rows:[] };
                let dir = path.join(__dirname, 'chart_data');
                let filepath = path.join(dir, `${chart.uuid}.json`);

                mkdirp(dir, err => {
                    fs.writeFile(filepath, JSON.stringify(data), 'utf8', err => {
                        if (err) console.log(err);
                    });
                });
            }
        });
    });

    // Save the settings file
    mkdirp(dir, err => {
        fs.writeFile(path.join(dir, 'settings.json'), JSON.stringify(req.body), 'utf8', err => {
            if (err) console.log(err);

            res.end();
        });
    });
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// app.get('/data/files', (req, res) => {
//     fs.readFile('./configs/jobs.json', 'utf8', (err, data) => {
//         if (err) console.log(err);

//         var config = JSON.parse(data);

//         var apiPromises = config.jobs.map(job => {
//             // Get promises for all the api calls so we can synchronize their responses
//             return job.buckets.map(bucket => {
//                 let params = { Bucket: bucket, Prefix: job.prefix };

//                 return getFileNames(params);
//             });
//         });

//         var flattenedApiPromises = [].concat.apply([], apiPromises);

//         // Execute the api calls
//         Promise
//             .all(flattenedApiPromises)
//             .then(apiResponses => {
//                 res.json(apiResponses);
//             })
//             .catch(reason => {
//                 console.log(reason);
//             });
//         });
// });

app.post('/api/charts/getcounts', (req, res) => {
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

                        let filePath = path.join(__dirname, 'chart_data', `${chart.uuid}.json`);

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

app.delete('/api/all', (req, res) => {
    fs.readdir(path.join(__dirname, 'chart_data'), 'utf8', (err, files) => {
        if (err) {
            console.log(err);
            res.end();
        } else {
            files.forEach(file => {
                fs.unlink(path.join(__dirname, 'chart_data', file), err => {
                    if (err) console.log(err);
                });
            });

            res.end();
        }
    });
});

// app.get('/data/processed/:bucket', (req, res) => {
//     var params = { Bucket: req.params.bucket, Prefix: 'click/integration-queue/v1/processed/'};
//     s3.listObjectsV2(params, function(err, data) {
//         let response = {
//             bucket: params.Bucket,
//             prefix: params.Prefix,
//             files: []
//         };

//         if (err) {
//             console.log(err);
//             res.json(response);
//         } else if (data && data.Contents && data.Contents.length > 0) {
//             response.files = data.Contents.map(file => `https://s3.console.aws.amazon.com/s3/object/${data.Name}/${file.Key}`);
//             return res.json(response);
//         }
//         else
//             return res.json(response);
//     });
// });

// Setup routes
app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});