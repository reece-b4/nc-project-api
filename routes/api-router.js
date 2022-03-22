const apiRouter = require("express").Router();

const usersRouter = require("./users-router");

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
