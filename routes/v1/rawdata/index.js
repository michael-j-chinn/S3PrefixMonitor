const rawdata = require('express').Router();
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');

const defaultRawData = [];

// Setup AWS
AWS.config.loadFromPath('./config/aws_config.json');
let s3 = new AWS.S3();

let getFileNames = function(params) {
    return new Promise((resolve, reject) => {
        s3.listObjectsV2(params, function(err, data) {
            let response = {
                bucket: params.Bucket,
                prefix: params.Prefix,
                files: []
            };

            if (err) {
                console.log(err);
                resolve(response);
            } else if (data && data.Contents && data.Contents.length > 0) {
                response.files = data.Contents.map(file => `https://s3.console.aws.amazon.com/s3/object/${data.Name}/${file.Key}`);
                return resolve(response);
            }
            else
                return resolve(response);
        });   
    });
};

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
                                promises.push(getFileNames({ Bucket: bucket, Prefix: chart.prefix }));
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