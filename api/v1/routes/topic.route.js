const express = require('express');
const route = express.Router();
const controller = require('../controller/topic.controller');

const validate = require("../validates/topic.validate");

// USER & ADMIN
route.get('/', controller.index);
route.get('/info/:id', controller.infoTopic);
route.get('/:slug', controller.detail);

// ADMIN ONLY (Nên thêm middleware check auth ở đây sau này)
route.post('/create', validate.create, controller.create);
route.patch('/update/:id', validate.create, controller.update);
route.delete('/delete/:id', controller.delete);
route.patch('/delete-many', controller.deleteMany);

module.exports = route;