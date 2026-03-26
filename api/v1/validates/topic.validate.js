module.exports.create = (req, res, next) => {
  if (!req.body.name) {
    return res.json({ code: 400, message: "Tên chủ đề không được để trống!" });
  }
  if (!req.body.thumbnail) {
    return res.json({ code: 400, message: "Vui lòng thêm ảnh minh họa!" });
  }
  next();
}