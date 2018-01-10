const AWS = require('aws-sdk');
const path = require('path');
const fs = required('fs');

module.exports = () => {

    // Decide how the SDK will get initialized in order of recommendation by AWS.

    // Check if there is a config on disk
    try {
        let configPath = path.join(__dirname, 'config', 'aws_config.json');
        AWS.config.loadFromPath('../../config/aws_config.json');
    } catch {
        // SDK will automatically check the following next:
            // Check if there are environment variables
            // Check if there are shared credentials
            // Try using IAM roles
    }

    // Get the S3 object
    let s3 = new AWS.S3();

    return {
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
        }
    };
};