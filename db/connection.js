const axios = require("axios");

require("dotenv").config({
  path: `${__dirname}/../.env.test`,
});

const projectApi = axios.create({
  baseURL: process.env.BASEURL,
});

module.exports = projectApi;
