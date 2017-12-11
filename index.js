const express = require('express');
const bodyParser = require('body-parser');

// Setup express
let app = express();

// Figure out which port
const PORT = process.env.PORT || 3000;

// Setup body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.json({success: true});
});

// Setup routes
app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});