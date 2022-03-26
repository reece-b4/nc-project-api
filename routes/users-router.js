const {
  getUsers,
  postUser,
  getUserByUserId,
  deleteUserByUserId,
  patchUserByUserId,
  getPetsByUserId,
  postPetByUserId,
} = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers).post(postUser);

usersRouter
  .route("/:userId")
  .get(getUserByUserId)
  .delete(deleteUserByUserId)
  .patch(patchUserByUserId);

usersRouter.route("/:userId/pets").get(getPetsByUserId).post(postPetByUserId);

module.exports = usersRouter;
