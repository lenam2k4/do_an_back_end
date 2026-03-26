const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const multer = require("multer");

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports.uploadImage = [
  upload.single("file"),
  async (req, res) => {
    try {
      const fileBuffer = req.file.buffer.toString("base64");

      const result = await cloudinary.v2.uploader.upload(
        `data:${req.file.mimetype};base64,${fileBuffer}`,
        { folder: "chat_images" }
      );

      res.json({ url: result.secure_url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  },
];
