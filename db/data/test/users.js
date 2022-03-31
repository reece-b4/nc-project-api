module.exports = [
  { username: "username0", lat: -1.069876, long: 51.6562 },
  {
    username: "username1",
    lat: -1.069876,
    long: 51.6562,
    pets: [{ name: "placeholderPet", petId: "pet1" }],
  },
  {
    username: "username2",
    lat: -1.069876,
    long: 51.6562,
    pets: [{ petId: "pet0" }, { petId: "notRemoved" }],
  },
  {
    username: "username3",
    lat: -1.069876,
    long: 51.6562,
    reviews: [
      {
        review_by: "user0",
        content: "Review text here",
        timestamp: 2,
      },
      {
        review_by: "user1",
        content: "Second review text here",
        timestamp: 1,
      },
      {
        review_by: "user4",
        content: "Third review text here",
        timestamp: 3,
      },
    ],
  },
  { username: "username4", lat: -1.069876, long: 51.6562 },
];
