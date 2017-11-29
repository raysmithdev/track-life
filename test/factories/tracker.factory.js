const faker = require("faker");
const moment = require("moment");


function createBlank() {
  return {
  name: faker.commerce.productName(),
  description: faker.company.catchPhraseDescriptor(),
  notes: faker.company.catchPhrase(),
  createdDate: new Date(),
  };
}

function createOneExisting(userId) {
  let tallyMarksObj = {};
  for (let i = 0; i < 6; i++) {
    //get 6 random dates
    let date = faker.date.between(
      moment().subtract(faker.random.number({ min: 1, max: 7 }), "months"),
      moment()
    );
    //reassigning to date as formatted
    date = moment(date).format("YYYY-MM-01");
    //randomly assign tally marks between 1-25
    tallyMarksObj[date] = faker.random.number({ min: 1, max: 25 });
  }

  return {
    userId: userId,
    name: faker.commerce.productName(),
    description: faker.company.catchPhraseDescriptor(),
    status: faker.random.objectElement({one: 1, two: 2}),
    notes: faker.company.catchPhrase(),
    createdDate: new Date(),
    tallyMarks: tallyMarksObj
  };
}

function createMany(userId, num) {
  let trackers = [];
  for (let i = 0; i < num; i++) {
    trackers.push(createOneExisting(userId));
  }
  return trackers;
}

module.exports = { createOneExisting, createMany, createBlank };
