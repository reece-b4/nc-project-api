const { fetchUsers, addUser } = require("../models/users.model");

const getUsers = (_, res, next) => {
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

const postUser = (req, res, next) => {
  const username = req.body.username;
  const usernameTaken = checkUsernameExists(username);
  return Promise.all([usernameTaken])
    .then(([usernameTaken]) => {
      if (usernameTaken) {
        return Promise.reject({
          status: 400,
          msg: "username taken",
        });
      }
      return addUser(username);
    })
    .then((data) => {
      const user = {
        userId: data.name.split("/").pop(),
        username: data.fields.username.stringValue,
      };
      res.status(201).send({ user });
    })
    .catch(next);
};

const checkUsernameExists = (username) => {
  return fetchUsers().then((data) => {
    if (
      data.some((user) => {
        if (user.fields.username.stringValue === username) return true;
      })
    )
      return true;
  });
};

module.exports = { getUsers, postUser };
