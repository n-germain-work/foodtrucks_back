const express = require('express');
const cors = require('cors');
const api = require('./src/routes');

const app = express();
app.use(express.json());
// TODO: configure cors
app.use(cors());

app.use('/api', api);

module.exports = app;
