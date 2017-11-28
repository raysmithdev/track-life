const faker = require("faker");
const { User } = require("../../src/user/user.model");
const trackerFactory = require("./tracker.factory");

const userTracker = trackerFactory.createOneExisting();

const newUser = {
  userName: faker.hacker.adjective(),
  password: faker.hacker.noun(),
  //confirm if it needs to be an array or if it pulls in
  trackerIds: userTracker._id
  // createdDate: new Date(),

};

function createMany(num) {
  let users = [];
  for (let i = 0; i < num; i++) {
    users.push(newUser); //?
  }
  return users;
}

// can load this file to see if it works individually
// console.log(createMany(1));
// console.log(userTracker);
module.exports = { createMany, newUser };
