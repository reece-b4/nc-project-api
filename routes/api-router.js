const apiRouter = require("express").Router();
const {getEndpointsInfo} = require('../controllers/endpoints.controller')

const usersRouter = require("./users-router");
const petsRouter = require("./pets-router");

apiRouter.use("/users", usersRouter);
apiRouter.use("/pets", petsRouter);
apiRouter.get("", getEndpointsInfo);

module.exports = apiRouter;
