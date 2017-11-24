const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

const mongoose = require("mongoose");

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const { User } = require("../src/tracker/tracker.model");
const userFactory = require("../test/factories/user.factory");

chai.use(chaiHttp);

// deletes entire database
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn("deleting test database");
    mongoose.connection
      .dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

// insert random users in database
function seedUserData() {
  console.info(`seeding users`);
  const seedData = userFactory.createMany(5);
  // console.log('seedData ->', seedData);
  //this puts it into the database
  return User.insertMany(seedData);
}

describe("tracker api", function() {
  //let mockUser - need to incorporate user;

  // start the server before test
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedUserData();
  });

  //remove db after each test
  afterEach(function() {
    return tearDownDb();
  });

  // close the server after the test is done
  after(function() {
    return closeServer();
  });

  describe("GET endpoint", function() {
    // Strategy:
    // 1. get back all users returned by GET request to url
    // 2. check res has correct status & data type
    // 3. check number of users returned is equal to number in database
    // 4. check if returned usershave correct keys
    // 5. check if individaul user have correct values
    const expectedKeys = [
      "firstName",
      "lastName",
      "userName",
      "password",
      "avatar",
      "trackerIds",
    ];

    it("return all existing users", function() {
      let res;
      return (
        chai
          .request(app)
          .get("/api/users")
          .then(_res => {
            res = _res;
            res.should.have.status(200);
            res.body.trackers.should.have.lengthOf.at.least(1);
            return User.count();
          })
          .then(count => {
            res.body.users.should.have.lengthOf(count);
          })
      );
    });

    it("users should return with expected keys", function() {
      let resTracker;
      return chai
        .request(app)
        .get("/api/users")
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.trackers.should.be.a("array");
          res.body.trackers.should.have.lengthOf.at.least(1);
          // check each response for expected keys
          res.body.trackers.forEach(function(tracker) {
            tracker.should.be.a("object");
            tracker.should.include.keys(expectedKeys);
          });
          // retrieve individual trackers & check for correct values
          resTracker = res.body.trackers[0];
          return Tracker.findById(resTracker.id);
        })
        .then(function(tracker) {
          // console.log('tracker ->', tracker.tallyMarks);
          resTracker.name.should.equal(tracker.name);
          resTracker.status.should.equal(tracker.status);
          resTracker.description.should.equal(tracker.description);
          resTracker.notes.should.equal(tracker.notes);
          // console.log('resTracker ->', resTracker.tallyMarks);
          // two objects have to use deep equal so it checks all the fields
          resTracker.tallyMarks.should.deep.equal(tracker.tallyMarks);
        });
    });

  describe("POST endpoint", function() {
    //Strategy:
    // 1. create new user
    // 2. check that user has right keys
    // 3. check that user has right id
    const expectedKeys = [
      "firstName",
      "lastName",
      "userName",
      "password",
      "avatar",
      "trackerIds",
    ];

    it("create a new tracker", function() {
      const newUser = userFactory.newUser;
      return (
        chai
          .request(app)
          //change user
          .post("/api/users")
          .send(newUser)
          .then(function(res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.id.should.not.be.null;
            res.body.should.include.keys(expectedKeys);
            res.body.userName.should.equal(newUser.userName);
            res.body.password.should.equal(newUser.password);
          })
      );
    });

  describe("DELETE endpoint", function() {
    //not sure if this will happen or not yet
  });
});
