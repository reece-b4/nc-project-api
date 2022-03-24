const {
  getUsers,
  postUser,
  getUserByUserId,
} = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);
usersRouter.post("/", postUser);

usersRouter.get("/:userId", getUserByUserId);

module.exports = usersRouter;
