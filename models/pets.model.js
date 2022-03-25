const db = require("../db/connection");

exports.fetchPets = async (species) => {
  let pets = db.collection("pets");
  if (species) pets = pets.where("species", "==", species);
  const snapshot = await pets.get();
  data = [];
  snapshot.forEach((doc) => {
    data.push({ petId: doc.id, info: doc.data() });
  });

  return data;
};

exports.fetchPetById = async (petId) => {
  let doc = await db.collection("pets").doc(petId).get();
  return { petId: doc.id, info: doc.data() };
};

exports.removePetById = async (petId, userId) => {
  let usersPets = await db.collection("users").doc(userId).get();
  usersPets = usersPets.data().pets;
  const updatedPets = usersPets.filter((pet) => pet.petId !== petId);
  const deleteFromPets = await db.collection("pets").doc(petId).delete();
  const deleteFromuser = await db.collection("users").doc(userId).update({
    pets: updatedPets,
  });

  await Promise.all([deleteFromPets, deleteFromuser]);
};
