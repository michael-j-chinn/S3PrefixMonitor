const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

// Set a global variable for root directory for child components to use
global.__basedir = __dirname;

// Setup express
let app = express();

// Figure out which port
const PORT = process.env.PORT || 3000;

// Setup body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Setup ability to serve static content
app.use(express.static('public'));

// Setup express routes
app.use('/', routes);

// Setup routes
app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});