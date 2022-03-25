const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-sorted"));

const app = require("../app");
const data = require("../db/data");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const { fetchPets } = require("../models/pets.model");
const { fetchUserByUserId } = require("../models/users.model");

beforeEach(() => seed(data));

describe("app", () => {
  describe("/users", () => {
    describe("GET", () => {
      it(`should have a status of 200 and return a list of all users on
          a key of 'users'. Each user is an object containing string values
          under the keys of 'userId' and 'username'`, () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).to.have.lengthOf(5);
            users.forEach((user) => {
              expect(user.userId).to.be.a("string");
              expect(user.username).to.be.a("string");
              expect(user.lat).to.be.a("number");
              expect(user.long).to.be.a("number");
            });
          });
      });
    });
    describe("POST", () => {
      it(`should have a status of 201 and return a new user object under
          the key of user`, () => {
        return request(app)
          .post("/api/users")
          .send({ username: "newUser" })
          .expect(201)
          .then(({ body: { user } }) => {
            expect(user).to.be.a("string");
          })
          .then(() => {
            return request(app)
              .get("/api/users")
              .expect(200)
              .then(({ body: { users } }) => {
                expect(users).to.have.lengthOf(6);
              });
          });
      });
      it(`should have a status 400 with "missing required field" on a key of msg
          when the request body is missing a field`, () => {
        return request(app)
          .post("/api/users")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("missing required field");
          });
      });
      it(`should have a status 400 with "username taken" on a key of msg when the
          username is already taken`, () => {
        return request(app)
          .post("/api/users")
          .send({ username: "username1" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("username taken");
          });
      });
    });
  });

  describe("/users/:userId", () => {
    describe("GET", () => {
      it("should have a status 200 with the requested user object on a key of user", () => {
        return request(app)
          .get("/api/users/user0")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user.username).to.equal("username0");
          });
      });
    });
    describe("DELETE", () => {
      it(`should have a status of 204 and the specified user should be removed from db`, () => {
        return request(app)
          .delete("/api/users/user4")
          .expect(204)
          .then(() => {
            return request(app).get("/api/users").expect(200);
          })
          .then(({ body: { users } }) => {
            expect(users).to.have.lengthOf(4);
          });
      });
      it(`should have a status of 404 with 'no user with that userId' on a key of msg
          when the :userId doesn't exist in the databse`, () => {
        return request(app)
          .delete("/api/users/user999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("no user with that userId");
          });
      });
    });
    describe("PATCH", () => {
      it(`should have a status of 200`, () => {
        return request(app)
          .patch("/api/users/user0")
          .send({ username: "updatedUsername" })
          .expect(200);
      });
      it(`should have a status of 404 with 'no user with that userId' on a key of msg
          when the :userId doesn't exist in the databse`, () => {
        return request(app)
          .patch("/api/users/user999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("no user with that userId");
          });
      });
    });
  });
  describe("/pets", () => {
    describe("GET", () => {
      it(`should have a status of 200 and return a list of all pets on
          a key of 'pets'. Each pet is an object containing string values
          under the keys of 'petId', 'name', 'species', 'desc' and 'img'
          as well as an int on the key of age, lat and long`, () => {
        return request(app)
          .get("/api/pets")
          .send({ userId: "user0" })
          .expect(200)
          .then(({ body: { pets } }) => {
            expect(pets).to.have.lengthOf(5);
            pets.forEach((pet) => {
              expect(pet.petId).to.be.a("string");
              expect(pet.name).to.be.a("string");
              expect(pet.species).to.be.a("string");
              expect(pet.desc).to.be.a("string");
              expect(pet.img).to.be.a("string");
              expect(pet.age).to.be.a("number");
              expect(pet.lat).to.be.a("number");
              expect(pet.long).to.be.a("number");
            });
          });
      });
      it(`should have a status of 200 and return a filtered list of pets by species`, () => {
        return request(app)
          .get("/api/pets?species=species0")
          .send({ userId: "user0" })
          .expect(200)
          .then(({ body: { pets } }) => {
            expect(pets).to.have.lengthOf(2);
            pets.forEach((pet) => {
              expect(pet.species).to.equal("species0");
            });
          });
      });
      it(`should have a status of 200 and be ordered by distance from user`, () => {
        return request(app)
          .get("/api/pets")
          .send({ userId: "user0" })
          .expect(200)
          .then(({ body: { pets } }) => {
            expect(pets).to.be.sortedBy("distance");
          });
      });
      it(`should have status 200 and can set max distance via a query`, () => {
        return request(app)
          .get("/api/pets?limit=20")
          .send({ userId: "user0" })
          .expect(200)
          .then(({ body: { pets } }) => {
            expect(pets).to.have.lengthOf(3);
            pets.forEach((pet) => {
              expect(pet.distance).to.be.lte(20);
            });
          });
      });
    });
  });

  describe("/users/:userId/pets", () => {
    describe("POST", () => {
      it("should have status 201 and a pet should be added to the pet collection and under the users pet array", () => {
        return request(app)
          .post("/api/users/user1/pets")
          .send({
            owner: "user1",
            name: "newPet",
            age: 1,
            species: "someSpecies",
            breed: "someBreed",
            img: "imageLink",
            lat: 11,
            long: 25,
            desc: "any desc",
            funFact: "fun",
          })
          .expect(201)
          .then(() => {
            return fetchPets();
          })
          .then((pets) => {
            expect(pets).to.have.lengthOf(6);
            expect(pets.some((pet) => pet.info.name === "newPet")).to.be.true;

            return fetchUserByUserId("user1");
          })
          .then((user) => {
            expect(user.info.pets).to.have.lengthOf(2);
          });
      });
    });
  });
});
