const db = require("../db/connection");
const { userData } = require("../db/data");

exports.fetchUsers = async () => {
  const users = db.collection("users");
  const snapshot = await users.get();
  data = [];
  snapshot.forEach((doc) => {
    data.push([doc.id, doc.data()]);
  });

  return data;
};

exports.addUser = (username) => {
  if (!username) {
    return Promise.reject({
      status: 400,
      msg: "missing required field",
    });
  }
  return db
    .post("/users", {
      fields: {
        username: {
          stringValue: "newUser",
        },
      },
    })
    .then(({ data }) => data);
};
