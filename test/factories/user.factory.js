const faker = require("faker");

function createOne() {
  // returns username & password
  return {
  userName: faker.hacker.adjective(),
  password: faker.hacker.noun(),
  //confirm if it needs to be an array or if it pulls in
  // trackerIds: userTracker.id  - is this needed? 
  // createdDate: new Date(),
  };
}

function createMany(num) {
  let users = [];
  for (let i = 0; i < num; i++) {
    users.push(createOne()); 
  }
  return users;
}

// can load this file to see if it works individually
// console.log(createMany(1));
// console.log(userTracker);
module.exports = { createMany, createOne };
