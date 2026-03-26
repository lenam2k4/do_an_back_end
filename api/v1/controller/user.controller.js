const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");
const ForgotPassword = require("../models/forgot-password.model");
const User = require("../models/user.model");
const md5 = require("md5");

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // Bỏ role ra khỏi query tìm kiếm ban đầu

    const user = await User.findOne({
      email: email,
      password: md5(password),
      deleted: false
    }).select("-password");

    if (user) {
      res.json({
        code: 200,
        user: user
      });
    } else {
      res.json({ code: 400, message: "Email hoặc mật khẩu không chính xác!" });
    }
  } catch (error) {
    res.json({ code: 400, message: "Lỗi hệ thống" });
  }
}

// [POST] /api/v1/users/create
module.exports.create = async (req, res) => {
    try {
        const { email, fullName, password, role } = req.body;

        const emailExist = await User.findOne({ email, deleted: false });
        if (emailExist) {
            return res.json({ code: 400, message: "Email đã tồn tại!" });
        }

        const record = new User({
            fullName,
            email,
            password: md5(password),
            token: generateHelper.generateRandomString(30),
            role: role || "user",
            state: 'offline', // Mặc định khi tạo mới
            favorites: { songs: [], artists: [], albums: [] } // Khởi tạo mảng yêu thích
        });

        await record.save();
        const userObject = record.toObject();
        delete userObject.password;

        res.json({ code: 200, data: userObject });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

// [GET] /api/v1/users/info/:id
module.exports.info = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({
      _id: id,
      // role: req.body.role
    }).select("-password");

    if (user) {
      res.json({
        code: 200,
        data: user
      });
    } else {
      res.json({
        code: 400,
        message: 'Not found user!'
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: error
    });
  }
}

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      // role: req.body.role,
      deleted: false
    }).select('-password');

    if (user) {
      const otp = generateHelper.generateRandomNumber(6)
      const options = {
        email: req.body.email,
        otp: otp,
        expireAt: Date.now()
      };

      const forgotPassword = new ForgotPassword(options);
      await forgotPassword.save();

      const subject = "Mã OTP xác minh lấy lại mật khẩu";
      const html = `Mã OTP xác minh của bạn là: <b>${otp}</b>. Thời hạn sử dụng là 3 phút!`;
      sendMailHelper.sendMail(req.body.email, subject, html);

      res.json({
        code: 200,
        data: forgotPassword
      });
    } else {
      res.json({
        code: 400,
        message: 'Not found user!'
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: error
    });
  }
}

// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const data = await ForgotPassword.findOne({
      email: req.body.email,
      otp: req.body.otp,
    });

    if (data) {
      res.json({
        code: 200,
        data: data
      });
    } else {
      res.json({
        code: 400,
        message: 'OTP is not correct!'
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: error
    });
  }
}

// [POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const data = await User.updateOne({
      email: email,
    }, {
      password: md5(password)
    });
    res.json({
      code: 200,
      data: data
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error
    });
  }
}

// [PATCH] /api/v1/users/info
module.exports.infoUser = async (req, res) => {
  const id = req.body.id;
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  try {
    const emailExist = await User.findOne({
      _id: {
        $ne: id
      },
      email: email,
      role: role
    });
    if (emailExist) {
      res.json({
        code: 400,
        message: "Email already exists in the system!"
      });
    } else {
      const user = await User.findOne({
        _id: id
      })
      if (user) {
        const data = await User.updateOne({
          _id: id,
        }, {
          fullName: fullName,
          email: email,
          password: password ? md5(password) : user.password
        });
        res.json({
          code: 200,
          data: data
        });
      } else {
        res.json({
          code: 400,
          message: "Not found User!"
        });
      }
    }
  } catch (error) {
    res.json({
      code: 400,
      message: error
    });
  }
}

module.exports.list = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const role = req.query.role || "";

        let find = {
            deleted: false,
            fullName: { $regex: keyword, $options: "i" }
        };

        if (role) find.role = role;

        // Bỏ .limit() và .skip() để trả về toàn bộ danh sách
        const users = await User.find(find)
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            code: 200,
            data: users,
            total: users.length // Front-end sẽ dùng số này để tính toán
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

// [PATCH] /api/v1/users/update/:id
module.exports.update = async (req, res) => {
    try {
        const id = req.params.id || req.body.id;
        const { fullName, email, password, role, photoURL } = req.body;

        // Kiểm tra email trùng (loại trừ user hiện tại)
        const emailExist = await User.findOne({
            _id: { $ne: id },
            email: email,
            deleted: false
        });

        if (emailExist) {
            return res.json({ code: 400, message: "Email đã được sử dụng bởi người khác!" });
        }

        const updateData = { fullName, email, role };
        if (password) updateData.password = md5(password);
        if (photoURL) updateData.photoURL = photoURL;

        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            updateData,
            { new: true } // Trả về bản ghi sau khi update
        ).select("-password");

        if (!updatedUser) {
            return res.json({ code: 400, message: "Không tìm thấy người dùng!" });
        }

        res.json({ code: 200, message: "Cập nhật thành công!", data: updatedUser });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

// [PATCH] /api/v1/users/change-status
module.exports.changeStatus = async (req, res) => {
    try {
        const { id, state } = req.body; // state: 'online' | 'offline'
        await User.updateOne({ _id: id }, { state, lastSeen: new Date() });
        res.json({ code: 200, message: "Cập nhật trạng thái thành công" });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

// [DELETE] /api/v1/users/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await User.updateOne(
            { _id: id },
            {
                deleted: true,
                deletedAt: new Date(),
                state: 'offline' // Khi xóa thì cho tài khoản offline luôn
            }
        );

        if (result.matchedCount === 0) {
            return res.json({
                code: 404,
                message: "Không tìm thấy người dùng để xóa!"
            });
        }

        res.json({
            code: 200,
            message: "Xóa người dùng thành công!"
        });

    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Lỗi hệ thống khi xóa!",
            error: error.message
        });
    }
};

// [PATCH] /api/v1/users/delete-many
module.exports.deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids; // Mảng các ID gửi từ Frontend lên

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.json({
                code: 400,
                message: "Danh sách ID không hợp lệ!"
            });
        }

        await User.updateMany(
            { _id: { $in: ids } },
            {
                deleted: true,
                deletedAt: new Date(),
                state: 'offline'
            }
        );

        res.json({
            code: 200,
            message: `Đã xóa thành công ${ids.length} người dùng!`
        });

    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Lỗi hệ thống khi xóa nhiều!",
            error: error.message
        });
    }
};

// [POST] /api/v1/users/login-admin
module.exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email,
      password: md5(password),
      deleted: false
    }).select("-password");

    if (user) {
      // Kiểm tra quyền Admin
      if (user.role !== "admin") {
        return res.json({ 
          code: 400, 
          message: "Bạn không có quyền truy cập vào trang quản trị!" 
        });
      }

      res.json({
        code: 200,
        user: user
      });
    } else {
      res.json({ code: 400, message: "Email hoặc mật khẩu không chính xác!" });
    }
  } catch (error) {
    res.json({ code: 500, message: "Lỗi hệ thống" });
  }
};