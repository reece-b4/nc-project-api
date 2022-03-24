const { fetchUsers, addUser } = require("../models/users.model");
const { isUsernameTaken } = require("../db/utils/utils");

exports.getUsers = (_, res, next) => {
  fetchUsers()
    .then((data) => {
      const users = data.map((user) => {
        return {
          userId: user.userId,
          username: user.info.username,
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
    .then((data) => {
      res.status(201).send({ user: data });
    })
    .catch(next);
};
