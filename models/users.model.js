const axios = require("axios");

const projectApi = axios.create({
  baseURL:
    "https://firestore.googleapis.com/v1/projects/partial-pet-test/databases/(default)/documents",
});

exports.fetchUsers = () => {
  return projectApi.get("/users").then(({ data: { documents } }) => documents);
};
