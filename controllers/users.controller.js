const {
  fetchUsers,
  addUser,
  fetchUserByUserId,
} = require("../models/users.model");
const { isUsernameTaken } = require("../db/utils/utils");

exports.getUsers = (_, res, next) => {
  fetchUsers()
    .then((data) => {
      const users = data.map((user) => {
        return {
          userId: user.userId,
          ...user.info,
        };
      });
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const username = req.body.username;
  return isUsernameTaken(username)
    .then((isTaken) => {
      if (isTaken)
        return Promise.reject({
          status: 400,
          msg: "username taken",
        });
      return addUser(username);
    })
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};

exports.getUserByUserId = (req, res, next) => {
  const userId = req.params.userId;
  return fetchUserByUserId(userId)
    .then((data) => {
      const user = { userId: data.userId, ...data.info };
      res.status(200).send({ user });
    })
    .catch(next);
};
