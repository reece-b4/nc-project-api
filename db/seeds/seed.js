const db = require("../connection");

async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

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

const seed = async ({ userData, petData }) => {
  // Delete users collection
  await deleteCollection(db, "users", 10);

  // Iterate through userData adding each user to the db
  await Promise.all(
    userData.map((user, index) => {
      return db.collection("users").doc(`user${index}`).set({
        username: user.username,
        lat: user.lat,
        long: user.long,
      });
    })
  );

  // Delete users collection
  await deleteCollection(db, "pets", 10);

  await Promise.all(
    petData.map((pet, index) => {
      return db.collection("pets").doc(`pet${index}`).set({
        name: pet.name,
        species: pet.species,
        desc: pet.desc,
        img: pet.img,
        age: pet.age,
        lat: pet.lat,
        long: pet.long,
      });
    })
  );
};

module.exports = seed;
