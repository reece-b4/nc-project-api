const db = require("../db/connection");

exports.fetchPets = async (species) => {
  let pets = db.collection("pets");
  if (species) pets = pets.where("species", "==", species)
  const snapshot = await pets.get();
  data = [];
  snapshot.forEach((doc) => {
    data.push({ petId: doc.id, info: doc.data() });
  });

  return data;
};
