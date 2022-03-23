const projectApi = require("../db/connection");

exports.fetchUsers = () => {
  return projectApi.get("/users").then(({ data: { documents } }) => {
    return documents ? documents : [];
  });
};
