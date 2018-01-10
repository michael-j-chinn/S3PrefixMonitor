const s3keys = require('express').Router();
const fs = require('fs');
const AWS = require('aws-sdk');

// Setup AWS
AWS.config.loadFromPath('./config/aws_config.json');
var s3 = new AWS.S3();

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

s3keys.get('/', (req, res) => {
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

module.exports = s3keys;