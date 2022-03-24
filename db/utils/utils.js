const db = require("../connection");
const { fetchUsers, fetchUserByUserId } = require("../../models/users.model");

exports.isUsernameTaken = async (username) => {
  const users = await fetchUsers();
  const isTaken = await users.some((user) => username === user.info.username);
  return isTaken;
};

exports.isUserIdPresent = async (userId) => {
  const doc = await fetchUserByUserId(userId);
  return !doc.info ? false : true;
};
