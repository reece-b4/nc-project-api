const axios = require("axios");

exports.seed = () => {
  const projectApi = axios.create({
    baseURL:
      "https://firestore.googleapis.com/v1/projects/partial-pet-test/databases/(default)/documents",
  });

  const userList = [
    { username: "username1" },
    { username: "username2" },
    { username: "username3" },
  ];

  userList.forEach((user) => {
    projectApi.post("/users", {
      fields: { username: { stringValue: user.username } },
    });
  });
};
