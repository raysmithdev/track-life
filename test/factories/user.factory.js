const faker = require("faker");

function createOne() {
  return {
    userName: faker.hacker.adjective(),
    password: faker.hacker.noun(),
  };
}

function createMany(num) {
  let users = [];
  for (let i = 0; i < num; i++) {
    users.push(createOne()); 
  }
  return users;
}

module.exports = { createMany, createOne };
