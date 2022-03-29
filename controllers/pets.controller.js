const {
  fetchPets,
  fetchPetById,
  removePetById,
  updatePetByPetId,
} = require("../models/pets.model");

const {
  getUserLatLongByUserId,
  calculateDistance,
} = require("../db/utils/utils");

exports.getPets = (req, res, next) => {
  const { species, limit, search } = req.query;
  const { userId } = req.body;
  return getUserLatLongByUserId(userId)
    .then(({ lat, long }) => {
      return Promise.all([lat, long, fetchPets(species)]);
    })
    .then(([lat, long, data]) => {
      let pets = data.filter((pet) => pet.info.owner !== userId);
      pets = pets.map((pet) => {
        const distance = calculateDistance(
          lat,
          long,
          pet.info.lat,
          pet.info.long
        );
        return {
          petId: pet.petId,
          distance: Math.round(distance * 10) / 10,
          ...pet.info,
        };
      });

      if (limit) pets = pets.filter((pet) => pet.distance <= limit);

      if (search) {
        const regex = RegExp(`.*${search}.*`, "g");
        pets = pets.filter((pet) => regex.test(JSON.stringify(pet)));
      }

      pets.sort((a, b) => a.distance - b.distance);
      res.status(200).send({ pets });
    })
    .catch(next);
};

exports.getPetById = (req, res, next) => {
  const { petId } = req.params;
  return fetchPetById(petId)
    .then((data) => {
      const pet = { petId: data.petId, ...data.info };
      res.status(200).send({ pet });
    })
    .catch(next);
};

exports.deletePetById = (req, res, next) => {
  const { petId } = req.params;
  const { userId } = req.body;
  return removePetById(petId, userId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchPetByPetId = (req, res, next) => {
  const { petId } = req.params;
  const { userId, updatedInfo } = req.body;
  return updatePetByPetId(petId, userId, updatedInfo)
    .then(() => {
      res.status(200).send();
    })
    .catch(next);
};
