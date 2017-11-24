const faker = require("faker");
const { User } = require("../../src/user/user.model");
const trackerFactory = require("../test/factories/tracker.factory");

const userTracker = trackerFactory.createOneExisting();

const newUser = {
  userName: faker.hacker.adjective(),
  password: faker.hacker.noun(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  notes: faker.company.catchPhrase(),
  // createdDate: new Date(),
  trackerIds: [userTracker.id], //confirm if it needs to be an array or if it pulls in
};

function createMany(num) {
  let users = [];
  for (let i = 0; i < num; i++) {
    users.push(newUser); //?
  }
  return users;
}

// can load this file to see if it works individually
// console.log(createOne());
module.exports = { createMany, newUser };
