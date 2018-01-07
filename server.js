const express = require('express');
const bodyParser = require('body-parser');
//const AWS = require('aws-sdk');
const fs = require('fs');
//const moment = require('moment');
const path = require('path');
const mkdirp = require('mkdirp');
const uuidv4 = require('uuid/v4');

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
// AWS.config.loadFromPath('./configs/aws_config.json');
// var s3 = new AWS.S3();

// Functions to get data from S3
// let getBucketCount = function(params) {
//     return new Promise((resolve, reject) => {
//         s3.listObjectsV2(params, function(err, data) {
//             if (err) {
//                 console.log(err);
//                 reject(0);
//             } else if (data && data.KeyCount)
//                 return resolve(data.KeyCount);
//             else
//                 return resolve(0);
//         });   
//     });
// };

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

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.json('{}');
        }

        let chartData = JSON.parse(data);

        res.send(chartData);
    });
});

app.post('/api/settings', (req, res) => {
    let dir = path.join(__dirname, 'config');

    let settings = req.body;

    // Make sure every entity has a unique ID before saving
    settings.rows.forEach(row => {
        if (row.uuid == undefined)
            row.uuid = uuidv4();

        row.charts.forEach(chart => {
            if (chart.uuid == undefined)
                chart.uuid = uuidv4();
        });
    });

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

// app.get('/data/poll', (req, res) => {
//     let date = moment().format('YYYYMMDDHHmm');
    
//     fs.readFile('./configs/jobs.json', 'utf8', (err, data) => {
//         if (err) console.log(err);

//         var config = JSON.parse(data);

//         config.jobs.forEach(job => {
//             let apiPromises = [];

//             // Get promises for all the api calls so we can synchronize their responses
//             job.buckets.forEach(bucket => {
//                 let params = { Bucket: bucket, Prefix: job.prefix };

//                 apiPromises.push(getBucketCount(params))
//             });

//             // Execute the api calls
//             Promise
//                 .all(apiPromises)
//                 .then(apiResponses => {
//                     // Write the row
//                     let columns = [date].concat(apiResponses);
//                     let dir = path.join(__dirname, 'public', 'data');
//                     let filePath = path.join(dir, job.filename);
//                     let dataTsv = columns.join('\t') + '\n';

//                     // Make sure the data directory exists
//                     mkdirp(dir, err => {
//                         // Make sure the file exists
//                         fs.exists(filePath, exists => {
//                             // If the file doesn't exist, write the column headers first.
//                             if (!exists) {
//                                 let columnHeaders = ['date'].concat(job.regions);
//                                 fs.writeFileSync(filePath, columnHeaders.join('\t') + '\n', 'utf8');
//                             }

//                             // Write the date to the file
//                             fs.appendFile(filePath, dataTsv, 'utf8', err => {
//                                 if (err) console.log(err);
                
//                                 res.end();
//                             });
//                         });
//                     });
//                 })
//                 .catch(reason => {
//                     console.log(reason);
//                 });;
//         });
//     });
// });

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