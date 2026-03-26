const express = require("express");
const router = express.Router();

const { uploadImage } = require("../controller/upload.controller");

router.post("/", uploadImage);

module.exports = router;
