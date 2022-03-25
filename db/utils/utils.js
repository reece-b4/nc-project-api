const db = require("../connection");
const { fetchUsers, fetchUserByUserId } = require("../../models/users.model");

exports.isUsernameTaken = async (username) => {
  const users = await fetchUsers();
  const isTaken = users.some((user) => username === user.info.username);
  return isTaken;
};

exports.isUserIdPresent = async (userId) => {
  const doc = await fetchUserByUserId(userId);
  return !doc.info ? false : true;
};

exports.getUserLatLongByUserId = async (userId) => {
  const doc = await fetchUserByUserId(userId);
  return { lat: doc.info.lat, long: doc.info.long };
};

exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  let radlat1 = (Math.PI * lat1) / 180;
  let radlat2 = (Math.PI * lat2) / 180;
  let theta = lon1 - lon2;
  let radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
};
