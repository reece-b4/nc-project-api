const projectApi = require("../db/connection");

exports.fetchUsers = () => {
  return projectApi.get("/users").then(({ data: { documents } }) => {
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
  return projectApi
    .post("/users", {
      fields: {
        username: {
          stringValue: "newUser",
        },
      },
    })
    .then(({ data }) => data);
};
