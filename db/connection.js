const fs = require("firebase-admin");

const { NODE_ENV = "test" } = process.env;

if (NODE_ENV === "production") {
  const firebaseCredentials = JSON.parse(
    Buffer.from(process.env.FIREBASE_CREDS, "base64").toString("ascii")
  );
  fs.initializeApp({
    credential: fs.credential.cert(firebaseCredentials),
  });
} else {
  const serviceAccount = require("../serviceAccountKey.json");
  fs.initializeApp({
    credential: fs.credential.cert(serviceAccount),
  });
}

const db = fs.firestore();

module.exports = db;
