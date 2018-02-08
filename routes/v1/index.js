const routesV1 = require('express').Router();

routesV1.use('/settings', require('./settings'));
routesV1.use('/charts', require('./charts'));
routesV1.use('/rawdata', require('./rawdata'));

module.exports = routesV1;