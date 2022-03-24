const { fetchUsers, addUser } = require("../models/users.model");

const getUsers = (_, res, next) => {
  fetchUsers()
    .then((data) => {
      const users = data.map((user) => {
        return {
          userId: user[0],
          username: user[1].username,
        };
      });
      res.status(200).send({ users });
    })
    .catch(next);
};

const postUser = (req, res, next) => {
  const username = req.body.username;
  // return checkUsernameExists(username)
  //   .then((isUsernameTaken) => {
  //     if (isUsernameTaken) {
  //       return Promise.reject({
  //         status: 400,
  //         msg: "username taken",
  //       });
  //     }
      return addUser(username)
    .then((data) => {
      res.status(201).send({ user: data });
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
