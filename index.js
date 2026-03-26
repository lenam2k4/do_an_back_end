const express = require('express');
require("dotenv").config();

const bodyParser = require('body-parser');

const database = require("./config/database");
database.connect();

const app = express();
const port = 3002;

const cors = require('cors');
app.use(cors());
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://quiz-app-front-end-nu2k.onrender.com'], // chỉ cho phép từ FE này
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   credentials: true
// }));
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
// }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

const route = require("./api/v1/routes/index");

route(app);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
})