const { getUsers, postUser } = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);
usersRouter.post("/", postUser);

module.exports = usersRouter;
