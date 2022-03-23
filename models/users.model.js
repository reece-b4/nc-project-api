const projectApi = require("../db/connection");

console.log(projectApi);

exports.fetchUsers = () => {
  return projectApi.get("/users").then(({ data: { documents } }) => documents);
};
