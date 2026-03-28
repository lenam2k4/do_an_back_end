const Question = require("../models/question.model");

// [GET] /api/v1/questions/:topicId
module.exports.index = async (req, res) => {
  const topicId = req.params.topicId;
  try {
    const questions = await Question.find({
      topicId: topicId,
      deleted: false
    }).sort({ createdAt: -1 });

    res.json({
      code: 200,
      data: questions
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message });
  }
}

// [GET] /api/v1/questions/info/:id
module.exports.info = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      deleted: false
    });
    res.json({ code: 200, data: question });
  } catch (error) {
    res.status(400).json({ code: 400, message: "Không tìm thấy câu hỏi!" });
  }
}

// [POST] /api/v1/questions/create
module.exports.create = async (req, res) => {
  try {
    const record = new Question(req.body);
    await record.save();

    res.json({
      code: 200,
      message: "Tạo câu hỏi thành công!",
      data: record
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: "Lỗi khi tạo câu hỏi!" });
  }
}

// [PATCH] /api/v1/questions/update/:id
module.exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    await Question.updateOne({ _id: id }, req.body);

    res.json({
      code: 200,
      message: "Cập nhật câu hỏi thành công!"
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: "Cập nhật thất bại!" });
  }
}

// [DELETE] /api/v1/questions/delete/:id
module.exports.delete = async (req, res) => {
  try {
    await Question.updateOne({ _id: req.params.id }, {
      deleted: true,
      deletedAt: new Date()
    });
    res.json({ code: 200, message: "Xóa câu hỏi thành công!" });
  } catch (error) {
    res.status(400).json({ code: 400, message: "Lỗi khi xóa!" });
  }
}