const db = require("../connection");
const { deleteCollection } = require("../utils/utils");

const seed = async ({ userData, petData }) => {
  await deleteCollection(db, "users", 10);

  await Promise.all(
    userData.map((user, index) => {
      return db
        .collection("users")
        .doc(`user${index}`)
        .set({ ...user });
    })
  );

  await deleteCollection(db, "pets", 10);

  await Promise.all(
    petData.map((pet, index) => {
      return db
        .collection("pets")
        .doc(`pet${index}`)
        .set({ ...pet });
    })
  );
};

module.exports = seed;
