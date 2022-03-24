const db = require("../connection");
const { fetchUsers } = require("../../models/users.model");

exports.isUsernameTaken = async (username) => {
  const users = await fetchUsers();
  const isTaken = await users.some((user) => username === user.info.username);
  return isTaken;
};
