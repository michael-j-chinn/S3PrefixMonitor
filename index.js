const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const mkdirp = require('mkdirp');

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
AWS.config.loadFromPath('./configs/aws_config.json');
var s3 = new AWS.S3();

// Functions to get data from S3
let getBucketCount = function(params) {
    return new Promise((resolve, reject) => {
        s3.listObjectsV2(params, function(err, data) {
            if (err) {
                console.log(err);
                reject(0);
            } else if (data && data.KeyCount)
                return resolve(data.KeyCount);
            else
                return resolve(0);
        });   
    });
};

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
                response.files = data.Contents.map(file => `${data.Name}/${file.Key}`);
                return resolve(response);
            }
            else
                return resolve(response);
        });   
    });
};

app.get('/', (req, res) => {
    res.json({ message: 'Visit index.html for charts or data/files for filenames.'});
});

app.get('/data/files', (req, res) => {
    fs.readFile('./configs/jobs.json', 'utf8', (err, data) => {
        if (err) console.log(err);

        var config = JSON.parse(data);

        var apiPromises = config.jobs.map(job => {
            // Get promises for all the api calls so we can synchronize their responses
            return job.buckets.map(bucket => {
                let params = { Bucket: bucket, Prefix: job.prefix };

                return getFileNames(params);
            });
        });

        var flattenedApiPromises = [].concat.apply([], apiPromises);

        // Execute the api calls
        Promise
            .all(flattenedApiPromises)
            .then(apiResponses => {
                res.json(apiResponses);
            })
            .catch(reason => {
                console.log(reason);
            });
        });
});

app.get('/data/pull', (req, res) => {
    let date = moment().format('YYYYMMDDHHmm');
    
    fs.readFile('./configs/jobs.json', 'utf8', (err, data) => {
        if (err) console.log(err);

        var config = JSON.parse(data);

        config.jobs.forEach(job => {
            let apiPromises = [];

            // Get promises for all the api calls so we can synchronize their responses
            job.buckets.forEach(bucket => {
                let params = { Bucket: bucket, Prefix: job.prefix };

                apiPromises.push(getBucketCount(params))
            });

            // Execute the api calls
            Promise
                .all(apiPromises)
                .then(apiResponses => {
                    // Write the row
                    let columns = [date].concat(apiResponses);
                    let dir = path.join(__dirname, 'public', 'data');
                    let filePath = path.join(dir, job.filename);
                    let dataTsv = columns.join('\t') + '\n';

                    // Make sure the data directory exists
                    mkdirp(dir, err => {
                        // Make sure the file exists
                        fs.exists(filePath, exists => {
                            // If the file doesn't exist, write the column headers first.
                            if (!exists) {
                                let columnHeaders = ['date'].concat(job.regions);
                                fs.writeFileSync(filePath, columnHeaders.join('\t') + '\n', 'utf8');
                            }

                            // Write the date to the file
                            fs.appendFile(filePath, dataTsv, 'utf8', err => {
                                if (err) console.log(err);
                
                                res.end();
                            });
                        });
                    });
                })
                .catch(reason => {
                    console.log(reason);
                });;
        });
    });
});

// Setup routes
app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});