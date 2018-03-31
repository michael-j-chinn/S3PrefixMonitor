const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

// Decide how the SDK will get initialized in order of recommendation by AWS.

// Check if there is a config on disk
try {
    let configPath = path.join(__dirname, 'config', 'aws_config.json');
    AWS.config.loadFromPath(configPath);
} catch(error) {
    // SDK will automatically check the following next:
        // Check if there are environment variables
        // Check if there are shared credentials
        // Try using IAM roles
}

// Get the S3 object
let s3 = new AWS.S3();

module.exports = {
    getKeyCount: (bucket, prefix) => {
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
    },
    getFileNames: (bucket, prefix) => {
        return new Promise((resolve, reject) => {
            s3.listObjectsV2({ Bucket: bucket, Prefix: chart.prefix }, function(err, data) {
                let response = {
                    bucket: bucket,
                    prefix: prefix,
                    files: []
                };
    
                if (err) {
                    console.log(err);
                    reject(response);
                } else if (data && data.Contents && data.Contents.length > 0) {
                    response.files = data.Contents.map(file => `https://s3.console.aws.amazon.com/s3/object/${data.Name}/${file.Key}`);
                    return resolve(response);
                }
                else
                    return resolve(response);
            });   
        });
    },
    getBucketCount: (chart, bucket, prefix) => {
        return new Promise((resolve, reject) => {
            s3.listObjectsV2({ Bucket: bucket, Prefix: chart.prefix }, function(err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else if (data && data.KeyCount)
                    return resolve({ chart, keyCount: data.KeyCount});
                else
                    return resolve({ chart, keyCount: 0});
            });   
        });
    }
};