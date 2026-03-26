const express = require('express');
const route = express.Router();

const controller = require('../controller/user.controller');
const validate = require("../validates/user.validate");

// AUTH
route.post('/login', validate.login, controller.login);
route.post('/login-admin', validate.login, controller.loginAdmin);
route.post('/create', validate.create, controller.create);

// USER
route.get('/', controller.list);
route.get('/info/:id', controller.info);

// Cập nhật thông tin: dùng validate.infoUser chung cho cả route profile và update admin
route.patch('/info', validate.infoUser, controller.update); 

// DELETE
route.delete('/delete/:id', controller.delete);
route.patch('/delete-many', controller.deleteMany);

// PASSWORD
route.post('/password/forgot', validate.forgotPassword, controller.forgotPassword);
route.post('/password/otp', validate.otpPassword, controller.otpPassword);
route.post('/password/reset', validate.resetPassword, controller.resetPassword);

module.exports = route;