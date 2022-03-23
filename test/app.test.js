const app = require("../app");
const { expect } = require("chai");

const data = require("../db/data");
const seed = require("../db/seeds/seed");

const request = require("supertest");

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
            expect(users).to.have.lengthOf(3);
            users.forEach((user) => {
              expect(user.userId).to.be.a("string");
              expect(user.username).to.be.a("string");
            });
          });
      });
    });
  });
});
