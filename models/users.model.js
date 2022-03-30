const { FieldValue } = require("@google-cloud/firestore");
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

exports.addUser = async (lat, long, area, userInfo) => {
  userInfo.lat = lat;
  userInfo.long = long;
  userInfo.area = area;
  const userId = userInfo.userId;
  await db.collection("users").doc(userId).set(userInfo);
  return userId;
};

exports.fetchUserByUserId = async (userId) => {
  const doc = await db.collection("users").doc(userId).get();
  return { userId: doc.id, info: doc.data() };
};

exports.removeUserByUserId = async (userId) => {
  let usersPets = await db.collection("users").doc(userId).get();
  usersPets = usersPets.data().pets || [];
  usersPets = usersPets.map((pet) => pet.petId);
  const removeFromUsers = await db.collection("users").doc(userId).delete();
  const removeUsersPets = usersPets.map((petId) => {
    return db.collection("pets").doc(petId).delete();
  });
  return Promise.all([removeFromUsers, ...removeUsersPets]);
};

exports.updateUserByUserId = async (userId, updatedFields) => {
  return await db.collection("users").doc(userId).update(updatedFields);
};

exports.addPetByUserId = async (userId, newPetInfo) => {
  const { info: userInfo } = await this.fetchUserByUserId(userId);
  const petId = await db.collection("pets").add({
    owner: userId,
    lat: userInfo.lat,
    long: userInfo.long,
    ...newPetInfo,
  });
  await db
    .collection("users")
    .doc(userId)
    .update({
      pets: FieldValue.arrayUnion({ petId: petId.id, ...newPetInfo }),
    });
};

exports.fetchPetsByUserId = async (userId) => {
  const userRef = await db.collection("users").doc(userId).get();
  return userRef.data().pets;
};

exports.addReviewToUserByUserId = async (userId, username, newReview) => {
  const timestamp = Date.now();
  await db
    .collection("users")
    .doc(userId)
    .update({
      reviews: FieldValue.arrayUnion({ username, timestamp, ...newReview }),
    });
};

exports.removeReviewFromUserByIndex = async (userId, index) => {
  let userReviews = await db.collection("users").doc(userId).get();
  userReviews = userReviews.data().reviews;
  userReviews.splice(index, 1);
  await db.collection("users").doc(userId).update({ reviews: userReviews });
};
