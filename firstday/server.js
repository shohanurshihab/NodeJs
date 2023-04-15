const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const sql = require('mssql');
//const config = require('./dbconfig');


const app = express();

// Parse incoming JSON requests
app.use(bodyParser.json());
// Use the routes defined in the routes.js file
app.use('/', routes);

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
