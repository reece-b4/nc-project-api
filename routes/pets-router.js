const petsRouter = require("express").Router();

const {
  getPets,
  getPetById,
  deletePetById,
} = require("../controllers/pets.controller");

petsRouter.route("/").get(getPets);
petsRouter.route("/:petId").get(getPetById).delete(deletePetById);

module.exports = petsRouter;
