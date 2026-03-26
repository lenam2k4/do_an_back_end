module.exports.login = (req, res, next) => {
  if (!req.body.email) return res.json({ code: 400, message: "Vui lòng nhập email!" });
  if (!req.body.password) return res.json({ code: 400, message: "Vui lòng nhập mật khẩu!" });
  next();
}

module.exports.create = (req, res, next) => {
  if (!req.body.fullName) return res.json({ code: 400, message: "Họ tên không được để trống!" });
  if (!req.body.email) return res.json({ code: 400, message: "Email không được để trống!" });
  if (!req.body.password) return res.json({ code: 400, message: "Mật khẩu không được để trống!" });
  next();
}

// Validate cho phần Cập nhật User (dùng cho cả Admin sửa hoặc User tự sửa)
module.exports.infoUser = (req, res, next) => {
  if (!req.body.fullName) return res.json({ code: 400, message: "Họ tên không được để trống!" });
  if (!req.body.email) return res.json({ code: 400, message: "Email không được để trống!" });
  // Password là tùy chọn khi sửa nên không bắt buộc ở đây
  next();
}

module.exports.forgotPassword = (req, res, next) => {
  if (!req.body.email) return res.json({ code: 400, message: "Vui lòng nhập email!" });
  next();
}

module.exports.otpPassword = (req, res, next) => {
  if (!req.body.email) return res.json({ code: 400, message: "Email thiếu!" });
  if (!req.body.otp) return res.json({ code: 400, message: "Vui lòng nhập OTP!" });
  next();
}

module.exports.resetPassword = (req, res, next) => {
  if (!req.body.email) return res.json({ code: 400, message: "Email thiếu!" });
  if (!req.body.password) return res.json({ code: 400, message: "Mật khẩu mới thiếu!" });
  if (req.body.password !== req.body.confirmPassword) {
    return res.json({ code: 400, message: "Xác nhận mật khẩu không khớp!" });
  }
  next();
}