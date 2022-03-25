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

exports.removeUserByUserId = async (userId) => {
  const doc = await db.collection("users").doc(userId).delete();
  return doc;
};

exports.updateUserByUserId = async (userId, updatedFields) => {
  return await db.collection("users").doc(userId).update(updatedFields);
};

exports.addPetByUserId = async (userId, newPetInfo) => {
  return await db.collection("pets").add(newPetInfo);
};
