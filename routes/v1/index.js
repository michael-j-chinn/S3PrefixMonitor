const routesV1 = require('express').Router();

routesV1.use('/settings', require('./settings'));
routesV1.use('/charts', require('./charts'));

module.exports = routesV1;