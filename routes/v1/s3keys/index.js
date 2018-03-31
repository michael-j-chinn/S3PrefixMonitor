const s3keys = require('express').Router();
const fs = require('fs');
const s3 = require('../../../services/S3Service');

s3keys.get('/', (req, res) => {
    fs.readFile('./configs/jobs.json', 'utf8', (err, data) => {
        if (err) console.log(err);

        var config = JSON.parse(data);

        var apiPromises = config.jobs.map(job => {
            // Get promises for all the api calls so we can synchronize their responses
            return job.buckets.map(bucket => {
                return s3.getFileNames(bucket, job.prefix);
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