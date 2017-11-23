const faker = require("faker");
const { Tracker } = require("../../src/tracker/tracker.model");
const moment = require("moment");


const newTracker = {
  userId: 123,  //replace?
  name: faker.commerce.productName(),
  description: faker.company.catchPhraseDescriptor(),
  // status: faker.random.number({ min: 1, max: 2 }),
  notes: faker.company.catchPhrase(),
  createdDate: new Date(),
  // tallyMarks: tallyMarksObj
};

//pass in userId?
function createOneExisting() {
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
    //add :userId back; hardcoded for now
    userId: 123, 
    name: faker.commerce.productName(),
    description: faker.company.catchPhraseDescriptor(),
    status: faker.random.objectElement({one: 1, two: 2}),
    // status: faker.random.number({ min: 1, max: 2 }),
    notes: faker.company.catchPhrase(),
    createdDate: new Date(),
    tallyMarks: tallyMarksObj
  };
}

function createMany(num) {
  let trackers = [];
  for (let i = 0; i < num; i++) {
    trackers.push(createOneExisting());
  }
  return trackers;
}


// can load this file to see if it works individually
// console.log(createOne());
module.exports = { createOneExisting, createMany, newTracker };
