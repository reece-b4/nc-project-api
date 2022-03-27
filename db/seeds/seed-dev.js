let axios = require("axios");

const data = require("../data");
const db = require("../connection");
const { deleteCollection } = require("../utils/utils");

axios = axios.create({ baseURL: process.env.BASE_URL });

const runSeed = async ({ userData, petData }) => {
  const deleteUsers = await deleteCollection(db, "users", 10);
  const deletePets = await deleteCollection(db, "pets", 10);
  await Promise.all([deleteUsers, deletePets]);

  // Add Users through API calls
  await Promise.all(
    userData.map((user) => {
      axios.post("/api/users", user);
    })
  );
};

runSeed(data.dev);
