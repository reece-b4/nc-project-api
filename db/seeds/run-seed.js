const seed = require("./seed");
const data = require("../data");

const runSeed = () => {
  seed(data);
};

runSeed();
