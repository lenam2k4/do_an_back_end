const express = require('express');
const route = express.Router();

const controller = require('../controller/answer.controller');

route.get('/', controller.index);

route.get('/:id', controller.detail);

route.post('/', controller.post);

module.exports = route;