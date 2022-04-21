const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-sorted"));

const app = require("../app");
const { test } = require("../db/data");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const { fetchPets, fetchPetById } = require("../models/pets.model");
const { fetchUserByUserId, fetchUsers } = require("../models/users.model");
const { describe } = require("mocha");
chai.config.truncateThreshold = 0;

beforeEach(() => seed(test));

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
      it(`should have a status of 201 and return the new user's userId under
          the key of userId. Postcode should be converted to lat/long`, () => {
        return request(app)
          .post("/api/users")
          .send({ userId: "user10", username: "newUser", postcode: "SW1A2AA" })
          .expect(201)
          .then(({ body: { userId } }) => {
            expect(userId).to.equal("user10");
          })
          .then(() => {
            return fetchUsers();
          })
          .then((users) => {
            expect(users).to.have.lengthOf(6);
            expect(users.some((user) => user.info.lat === 51.50354)).to.equal(
              true
            );
            expect(users.some((user) => user.info.long === -0.127695)).to.equal(
              true
            );
            expect(users.some((user) => user.userId === "user10")).to.equal(
              true
            );
            expect(
              users.some((user) => user.info.area === "St James's")
            ).to.equal(true);
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
      it(`delete all of the users pets from the pets collection`, () => {
        return request(app)
          .delete("/api/users/user1")
          .expect(204)
          .then(() => {
            return fetchPets();
          })
          .then((pets) => {
            expect(pets).to.have.lengthOf(4);
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
    describe("PATCH", () => {
      it(`should have a status of 200 and return a list of all pets on
          a key of 'pets'. Each pet is an object containing string values
          under the keys of 'petId', 'name', 'species', 'desc' and 'img'
          as well as an int on the key of age, lat and long`, () => {
        return request(app)
          .patch("/api/pets")
          .send({ userId: "user3" })
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
      it(`should filter out any pets owned by the userId sent in the body`, () => {
        return request(app)
          .patch("/api/pets")
          .send({ userId: "user1" })
          .expect(200)
          .then(({ body: { pets } }) => {
            expect(pets).to.have.lengthOf(4);
          });
      });
      it(`should have a status of 200 and return a filtered list of pets by species`, () => {
        return request(app)
          .patch("/api/pets?species=species0")
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
          .patch("/api/pets")
          .send({ userId: "user0" })
          .expect(200)
          .then(({ body: { pets } }) => {
            expect(pets).to.be.sortedBy("distance");
          });
      });
      it(`should have status 200 and can set max distance via a query`, () => {
        return request(app)
          .patch("/api/pets?limit=20")
          .send({ userId: "user0" })
          .expect(200)
          .then(({ body: { pets } }) => {
            expect(pets).to.have.lengthOf(3);
            pets.forEach((pet) => {
              expect(pet.distance).to.be.lte(20);
            });
          });
      });
      it(`should have status 200 and can filter out based on a search query`, () => {
        return request(app)
          .patch("/api/pets?search=inquiro")
          .send({ userId: "user0" })
          .expect(200)
          .then(({ body: { pets } }) => {
            expect(pets).to.have.lengthOf(1);
          });
      });
    });
  });
  describe("/users/:userId/pets", () => {
    describe("GET", () => {
      it(`should have status 200 and return an array of pet objects for the parameter user`, () => {
        return request(app)
          .get("/api/users/user2/pets")
          .expect(200)
          .then(({ body: { pets } }) => {
            expect(pets).to.have.lengthOf(2);
          });
      });
    });
    describe("POST", () => {
      it(`should have status 201 and a pet should be added to the pet collection
          and under the users pet array, The users lat and long should also be inherited
          by the pet in the pets collection`, () => {
        return request(app)
          .post("/api/users/user1/pets")
          .send({
            name: "newPet",
            age: 1,
            species: "someSpecies",
            breed: "someBreed",
            img: "imageLink",
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

            return Promise.all([pets, fetchUserByUserId("user1")]);
          })
          .then(([pets, user]) => {
            expect(user.info.pets).to.have.lengthOf(2);
            expect(pets[0].info.lat).to.equal(user.info.lat);
            expect(pets[0].info.long).to.equal(user.info.long);
          });
      });
    });
  });
  describe("/users/:userId/reviews", () => {
    describe("GET", () => {
      it(`should have a status of 200 and return an array of reviews for that
          user under the key of reviews`, () => {
        return request(app)
          .get("/api/users/user3/reviews")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).to.have.lengthOf(3);
          });
      });
    });
    describe("POST", () => {
      it(`should have a status 201 and the new review should be added to the users
          review array with a generated timestamp (number)`, () => {
        return request(app)
          .post("/api/users/user3/reviews")
          .send({
            reviewerId: "user1",
            content: "New review in array",
          })
          .expect(201)
          .then(() => {
            return request(app)
              .get("/api/users/user3/reviews")
              .then(({ body: { reviews } }) => {
                expect(reviews).to.have.lengthOf(4);
                expect(reviews[0].timestamp).to.be.a("number");
                expect(reviews[0].username).to.equal("username1");
              });
          });
      });
    });
    describe("DELETE", () => {
      it(`should have a status 204 and the review matching the index should be
          deleted from the users review array`, () => {
        return request(app)
          .delete("/api/users/user3/reviews")
          .send({ index: 0 })
          .expect(204)
          .then(() => {
            return request(app)
              .get("/api/users/user3/reviews")
              .then(({ body: { reviews } }) => {
                expect(reviews).to.have.lengthOf(2);
                expect(reviews[0].content).to.equal("Third review text here");
              });
          });
      });
    });
  });
  describe("/pets/:petId", () => {
    describe("GET", () => {
      it(`should have status of 200 and return pet object with string values under the keys of
         'petId', 'name', 'species', 'desc' and 'img' as well as an int on the key of age `, () => {
        return request(app)
          .get("/api/pets/pet0")
          .expect(200)
          .then(({ body: { pet } }) => {
            expect(pet.petId).to.equal("pet0");
            expect(pet.age).to.equal(1);
            expect(pet.desc).to.equal("pet0 desc");
            expect(pet.img).to.equal("https://img.com");
            expect(pet.lat).to.equal(-1.069876);
            expect(pet.long).to.equal(51.6562);
            expect(pet.name).to.equal("pet0");
            expect(pet.species).to.equal("species0");
          });
      });
    });
    describe("PATCH", () => {
      it(`should have status of 200 and the pet with the petId parameter is updated
          in both the pets collection and under the appropriate user`, () => {
        return request(app)
          .patch("/api/pets/pet1")
          .send({ userId: "user1", updatedInfo: { name: "newName", age: 100 } })
          .expect(200)
          .then(() => {
            return fetchPetById("pet1");
          })
          .then((data) => {
            expect(data.info.name).to.equal("newName");
            expect(data.info.age).to.equal(100);

            return fetchUserByUserId("user1");
          })
          .then((data) => {
            const updatedPet = data.info.pets[0];
            expect(updatedPet.name).to.equal("newName");
            expect(updatedPet.age).to.equal(100);
          });
      });
    });
    describe("DELETE", () => {
      it(`should have a status of 204 and delete pet by its id in both the pets collection
          and under the relevant users' pets array`, () => {
        return request(app)
          .delete("/api/pets/pet0")
          .send({ userId: "user2" })
          .expect(204)
          .then(() => {
            return fetchPets();
          })
          .then((pets) => {
            expect(pets).to.have.lengthOf(4);

            return fetchUserByUserId("user2");
          })
          .then((user) => {
            expect(user.info.pets).to.have.lengthOf(1);
            expect(user.info.pets[0].petId).to.equal("notRemoved");
          });
      });
    });
  });
  describe("/api", () => {
    describe("GET", ()=> {
      it('should return JSON describing all available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((res)=> {
          expect(Object.keys(res.body.endpoints)).to.eql(["GET /api", "GET /api/users", "POST /api/users", "GET users/:userId", "DELETE users/:userId", "PATCH users/:userId", "GET users/:userId/reviews", "POST users/:userId/reviews", "DELETE users/:userId/reviews", "GET users/:userId/pets", "POST users/:userId/pets", "PATCH pets", "GET /pets/:petId", "PATCH /pets/:petId", "DELETE /pets/:petId"])
        })
      })
    })
  })
});

