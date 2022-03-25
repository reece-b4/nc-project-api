const { fetchPets } = require("../models/pets.model");

exports.getPets = (req, res, next) => {
  const {species} = req.query;
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
