const { handleCustomErrors } = require("./controllers/errors.controller");

const express = require("express");

const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);

module.exports = app;
