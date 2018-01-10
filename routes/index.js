const routes = require('express').Router();

routes.use('/api/v1', require('./v1'));

routes.get('*', (req, res) => {
    res.sendFile(__basedir + '/public/index.html');
});

module.exports = routes;