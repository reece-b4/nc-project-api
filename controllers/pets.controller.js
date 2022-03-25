const { fetchPets } = require("../models/pets.model");

const {
  getUserLatLongByUserId,
  calculateDistance,
} = require("../db/utils/utils");

exports.getPets = (req, res, next) => {
  const { species } = req.query;
  const { userId } = req.body;
  return getUserLatLongByUserId(userId)
    .then(({ lat, long }) => {
      return Promise.all([lat, long, fetchPets(species)]);
    })
    .then(([lat, long, data]) => {
      const pets = data.map((pet) => {
        const distance = calculateDistance(
          lat,
          long,
          pet.info.lat,
          pet.info.long
        );
        return {
          petId: pet.petId,
          distance: distance,
          ...pet.info,
        };
      });
      pets.sort((a, b) => a.distance - b.distance);
      res.status(200).send({ pets });
    })
    .catch(next);
};
