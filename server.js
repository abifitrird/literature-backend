const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "./uploads/images/" });
const fs = require("fs");
const cors = require("cors");
// const port = 5000;
const port = process.env.PORT || 5000;

require("dotenv").config();

require("express-group-routes");

const router = require("./routes/router");

app.use(express.static("uploads/images"));

app.use(cors());

app.use(express.json());

app.use("/api/v1/", router);

app.listen(port, () => console.log(`Listening on port ${port}`));
