const db = require("../db/connection");

exports.fetchUsers = async () => {
  const users = db.collection("users");
  const snapshot = await users.get();
  data = [];
  snapshot.forEach((doc) => {
    data.push({ userId: doc.id, info: doc.data() });
  });

  return data;
};

exports.addUser = async (username) => {
  if (!username)
    return Promise.reject({ status: 400, msg: "missing required field" });
  const newUser = await db.collection("users").add({
    username: username,
  });
  return newUser.id;
};

exports.fetchUserByUserId = async (userId) => {
  const doc = await db.collection("users").doc(userId).get();
  return { userId: doc.id, info: doc.data() };
};
