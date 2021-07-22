const express = require('express');

const trucks = require('./trucks');

const router = express.Router();

router.use('/trucks', trucks);

module.exports = router;
