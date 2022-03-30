const axios = require("axios");

const { fetchUsers, fetchUserByUserId } = require("../../models/users.model");

exports.deleteCollection = async (db, collectionPath, batchSize) => {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
};

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

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

exports.getDetailsFromPostcode = (postcode) => {
  return axios
    .get(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(({ data: { result } }) => {
      return {
        lat: result.latitude,
        long: result.longitude,
        adminWard: result.admin_ward,
      };
    });
};
