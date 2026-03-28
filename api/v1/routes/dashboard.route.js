const express = require('express');
const route = express.Router();
const controller = require('../controller/dashboard.controller');

route.get('/statistic', controller.statistic);

module.exports = route;