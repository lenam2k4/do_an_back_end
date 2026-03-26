const express = require("express");
const route = express.Router();

const controller = require("../controller/chatbot.controller");

route.post("/", controller.chatbot);

module.exports = route