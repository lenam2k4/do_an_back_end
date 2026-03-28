const express = require('express');
const route = express.Router();
const controller = require('../controller/question.controller');

// [GET] /api/v1/questions/:topicId - Lấy danh sách câu hỏi theo chủ đề
route.get('/:topicId', controller.index);

// [GET] /api/v1/questions/info/:id - Lấy chi tiết một câu hỏi
route.get('/info/:id', controller.info);

// [POST] /api/v1/questions/create - Tạo câu hỏi mới
route.post('/create', controller.create);

// [PATCH] /api/v1/questions/update/:id - Chỉnh sửa câu hỏi
route.patch('/update/:id', controller.update);

// [DELETE] /api/v1/questions/delete/:id - Xóa câu hỏi (Soft delete)
route.delete('/delete/:id', controller.delete);

module.exports = route;