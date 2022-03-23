const projectApi = require("../db/connection");

exports.fetchUsers = () => {
  return projectApi.get("/users").then(({ data: { documents } }) => {
    return documents ? documents : [];
  });
};

exports.addUser = (username) => {
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
