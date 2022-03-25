const db = require("../db/connection");

exports.fetchPets = async () => {
  const pets = db.collection("pets");
  const snapshot = await pets.get();
  data = [];
  snapshot.forEach((doc) => {
    data.push({ petId: doc.id, info: doc.data() });
  });

  return data;
};
