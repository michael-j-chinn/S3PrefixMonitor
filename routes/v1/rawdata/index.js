const rawdata = require('express').Router();
const path = require('path');
const fs = require('fs');
const s3 = require('../../../services/S3Service');

const defaultRawData = [];

rawdata.get('/', (req, res) => {
    let settingsFilePath = path.join(__basedir, 'config', 'settings.json');

    fs.exists(settingsFilePath, exists => {
        if (exists) {
            fs.readFile(settingsFilePath, 'utf8', (err, data) => {
                if (err) {
                    res.json(defaultRawData);
                } else {
                    let settings = JSON.parse(data);

                    let promises = [];
                    settings.rows.forEach(row => {
                        row.charts.forEach(chart => {
                            // Chart can have multiple buckets
                            let buckets = chart.buckets.split(',');

                            buckets.forEach(bucket => {
                                promises.push(s3.getFileNames(bucket, chart.prefix));
                            });
                        });
                    });

                     // Execute the bucket count requests. Responses come back in same order requested.
                    Promise
                    .all(promises)
                    .then(apiResponses => {
                        res.json(apiResponses);
                    })
                    .catch(reason => {
                        console.log(reason);
                        res.json(defaultRawData);
                    });
                }
            });
        } else {
            res.json(defaultRawData);
        }
    });
});

module.exports = rawdata;