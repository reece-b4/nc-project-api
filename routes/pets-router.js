const petsRouter = require("express").Router();

const { getPets, getPetById } = require("../controllers/pets.controller");

petsRouter.route("/").get(getPets);
petsRouter.route("/:petId").get(getPetById);

module.exports = petsRouter;
