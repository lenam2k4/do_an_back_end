const express = require('express');
const route = express.Router();

const controller = require('../controller/question.controller');

route.get('/:topicId', controller.index);

module.exports = route;