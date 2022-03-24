const {
  getUsers,
  postUser,
  getUserByUserId,
  deleteUserByUserId,
} = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers).post(postUser);

usersRouter.route("/:userId").get(getUserByUserId).delete(deleteUserByUserId);

module.exports = usersRouter;
