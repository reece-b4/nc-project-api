const projectApi = require("../connection");
const { fetchUsers } = require("../../models/users.model");

const seed = async ({ userData }) => {
  // Get list of current userIds and delete them from database
  let users = await fetchUsers();
  const userIds = users.map((user) => user.name.split("/").pop());

  // Delete all of the users in the database via their ids
  await Promise.all(
    userIds.map(async (userId) => {
      await projectApi.delete(`/users/${userId}`);
    })
  );

  // Post userdata to users
  await Promise.all(
    userData.map(async (user) => {
      await projectApi.post("/users", {
        fields: { username: { stringValue: user.username } },
      });
    })
  );
};

module.exports = seed;
