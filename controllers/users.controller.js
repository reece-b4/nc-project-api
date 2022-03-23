const { fetchUsers, addUser } = require("../models/users.model");

exports.getUsers = (_, res, next) => {
  fetchUsers()
    .then((data) => {
      const users = data.map((user) => {
        return {
          userId: user.name.split("/").pop(),
          username: user.fields.username.stringValue,
        };
      });
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const username = req.body.username;
  addUser(username)
    .then((data) => {
      const user = {
        userId: data.name.split("/").pop(),
        username: data.fields.username.stringValue,
      };
      res.status(201).send({ user });
    })
    .catch(next);
};
