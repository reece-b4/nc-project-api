const apiRouter = require("express").Router();

const usersRouter = require("./users-router");
const petsRouter = require("./pets-router");

apiRouter.use("/users", usersRouter);
apiRouter.use("/pets", petsRouter);

module.exports = apiRouter;
