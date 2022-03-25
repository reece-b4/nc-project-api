const petsRouter = require("express").Router();

const { getPets } = require("../controllers/pets.controller");

petsRouter.route("/").get(getPets);

module.exports = petsRouter;
