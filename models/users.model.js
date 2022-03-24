const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.get("/users").then(({ data: { documents } }) => {
    return documents ? documents : [];
  });
};

exports.addUser = (username) => {
  if (!username) {
    return Promise.reject({
      status: 400,
      msg: "missing required field",
    });
  }
  return db
    .post("/users", {
      fields: {
        username: {
          stringValue: "newUser",
        },
      },
    })
    .then(({ data }) => data);
};
