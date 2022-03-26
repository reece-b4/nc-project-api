const { handleCustomErrors } = require("./controllers/errors.controller");
const cors = require("cors");
const express = require("express");

const apiRouter = require("./routes/api-router");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);

module.exports = app;
