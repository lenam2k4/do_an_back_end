const Topic = require("../models/topic.model");

// [GET] /api/v1/topics
module.exports.index = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    
    let find = {
      deleted: false,
      name: { $regex: keyword, $options: "i" }
    };

    const topics = await Topic.find(find).sort({ createdAt: -1 });

    res.json({
      code: 200,
      data: topics
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message });
  }
}

// [GET] /api/v1/topics/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  try {
    const topic = await Topic.findOne({
      slug: slug,
      deleted: false
    });

    res.json({
      code: 200,
      data: topic
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error
    });
  }
}

// [GET] /api/v1/topics/info/:id
module.exports.infoTopic = async (req, res) => {
  const id = req.params.id;
  try {
    const topic = await Topic.findOne({
      _id: id,
      deleted: false
    });

    res.json({
      code: 200,
      data: topic
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error
    });
  }
}

// [POST] /api/v1/topics/create
module.exports.create = async (req, res) => {
  try {
    const record = new Topic(req.body);
    await record.save();

    res.json({
      code: 200,
      message: "Tạo chủ đề thành công!",
      data: record
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: "Lỗi khi tạo chủ đề!" });
  }
}

// [PATCH] /api/v1/topics/update/:id
module.exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    await Topic.updateOne({ _id: id }, req.body);

    res.json({
      code: 200,
      message: "Cập nhật thành công!"
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: "Cập nhật thất bại!" });
  }
}

// [DELETE] /api/v1/topics/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Topic.updateOne({ _id: id }, {
      deleted: true,
      deletedAt: new Date()
    });

    res.json({
      code: 200,
      message: "Xóa chủ đề thành công!"
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: "Lỗi hệ thống khi xóa!" });
  }
}

// [PATCH] /api/v1/topics/delete-many
module.exports.deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    await Topic.updateMany({ _id: { $in: ids } }, {
      deleted: true,
      deletedAt: new Date()
    });

    res.json({
      code: 200,
      message: "Xóa danh sách chủ đề thành công!"
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: "Lỗi khi xóa nhiều!" });
  }
}