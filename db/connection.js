const fs = require("firebase-admin");

const { NODE_ENV = "dev" } = process.env;

if (NODE_ENV === "test") {
  const serviceAccount = require("../serviceAccountKey.json");
  fs.initializeApp({
    credential: fs.credential.cert(serviceAccount),
  });
} else {
  if (NODE_ENV === "dev") {
    require("dotenv").config({
      path: `${__dirname}/../.env.dev`,
    });
  }
  const firebaseCredentials = JSON.parse(
    Buffer.from(process.env.FIREBASE_CREDS, "base64").toString("ascii")
  );
  fs.initializeApp({
    credential: fs.credential.cert(firebaseCredentials),
  });
}

const db = fs.firestore();

module.exports = db;
