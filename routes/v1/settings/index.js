const settings = require('express').Router();
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

let defaultSettings = { rows:[] };

settings.get('/', (req, res) => {
    let settingsFilePath = path.join(__basedir, 'config', 'settings.json');

    fs.readFile(settingsFilePath, 'utf8', (err, data) => {
        if (err)
            res.json(defaultSettings);
        else
            res.json(JSON.parse(data));
    });
});

settings.post('/', (req, res) => {
    let dir = path.join(__basedir, 'config');

    // Make sure every entity has a unique ID and data file.
    req.body.rows.forEach(row => {
        if (row.uuid == undefined)
            row.uuid = uuidv4();

        row.charts.forEach(chart => {
            if (chart.uuid == undefined) {
                chart.uuid = uuidv4();

                // Create a matching data file for this chart.
                let buckets = chart.buckets.split(',');
                let data = { columns: ['date'].concat(buckets), rows:[] };
                let dir = path.join(__basedir, 'chart_data');
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

module.exports = settings;