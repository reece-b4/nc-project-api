const { fetchPets, fetchPetById } = require("../models/pets.model");

exports.getPets = (req, res, next) => {
  const { species } = req.query;
  fetchPets(species)
    .then((data) => {
      const pets = data.map((pet) => {
        return {
          petId: pet.petId,
          ...pet.info,
        };
      });
      res.status(200).send({ pets });
    })
    .catch(next);
};

exports.getPetById = (req, res, next) => {
  const { petId } = req.params;
  return fetchPetById(petId)
    .then((data) => {
      const pet = { petId: data.petId, ...data.info};
      res.status(200).send({ pet });
    })
    .catch(next);
};
