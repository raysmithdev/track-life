const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const jwt = require("jsonwebtoken");
const faker = require("faker");

const mongoose = require("mongoose");

const { app, runServer, closeServer } = require("../server");
const { JWT_EXPIRY, JWT_SECRET, TEST_DATABASE_URL } = require("../config");
const { Tracker } = require("../src/tracker/tracker.model");
const { User } = require("../src/user/user.model");

const trackerFactory = require("./factories/tracker.factory");
const userFactory = require("./factories/user.factory");

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
// create test user
function createTestUser() {
  console.info(`creating test user`);
  const testUser = userFactory.createOne();
  return User.create(testUser);
}

// insert random trackers in database
function seedTrackerData(userId) {
  console.info(`seeding trackers`);
  const seedData = trackerFactory.createMany(userId, 10);
  return Tracker.insertMany(seedData);
}

const createAuthToken = user => {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.userName,
    expiresIn: JWT_EXPIRY,
    algorithm: "HS256"
  });
};

describe("tracker api", function() {
  let testUser;
  let mockJwt;
  // start the server before test
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(async function() {
    testUser = await createTestUser();
    mockJwt = createAuthToken(testUser);
    return seedTrackerData(testUser._id);
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
    // 1. get back all trackers returned by GET request to url
    // 2. check res has correct status & data type
    // 3. check number of trackers returned is equal to number in database
    // 4. check if returned trackers have correct keys
    // 5. check if individaul trackers have correct values
    const expectedKeys = [
      "id",
      "userId",
      "name",
      "description",
      "status",
      "notes",
      "tallyMarks"
    ];

    it("return all existing trackers", function() {
      let res;
      return chai
        .request(app)
        .get(`/api/users/${testUser._id}/trackers`)
        .set("Authorization", `Bearer ${mockJwt}`)
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.trackers.should.have.lengthOf.at.least(1);
          return Tracker.count();
        })
        .then(count => {
          res.body.trackers.should.have.lengthOf(count);
        });
    });

    it("trackers should return with expected keys", function() {
      let resTracker;
      return chai
        .request(app)
        .get(`/api/users/${testUser._id}/trackers`)
        .set("Authorization", `Bearer ${mockJwt}`)
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
          resTracker.name.should.equal(tracker.name);
          resTracker.status.should.equal(tracker.status);
          resTracker.description.should.equal(tracker.description);
          resTracker.notes.should.equal(tracker.notes);
          resTracker.tallyMarks.should.deep.equal(tracker.tallyMarks);
        });
    });

    it("return trackers with active status", function() {
      let resTracker;
      return chai
        .request(app)
        .get(`/api/users/${testUser._id}/trackers/active`)
        .set("Authorization", `Bearer ${mockJwt}`)
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
          resTracker.name.should.equal(tracker.name);
          resTracker.status.should.equal(tracker.status);
          resTracker.description.should.equal(tracker.description);
          resTracker.notes.should.equal(tracker.notes);
          resTracker.tallyMarks.should.deep.equal(tracker.tallyMarks);
        });
    });

    it("return trackers with archive status", function() {
      let resTracker;
      return chai
        .request(app)
        .get(`/api/users/${testUser._id}/trackers/archived`)
        .set("Authorization", `Bearer ${mockJwt}`)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.trackers.should.be.a("array");
          res.body.trackers.should.have.lengthOf.at.least(1);
          res.body.trackers.forEach(function(tracker) {
            tracker.should.be.a("object");
            tracker.should.include.keys(expectedKeys);
          });
          // retrieve individual trackers & check for correct values
          resTracker = res.body.trackers[0];
          return Tracker.findById(resTracker.id);
        })
        .then(function(tracker) {
          resTracker.name.should.equal(tracker.name);
          resTracker.status.should.equal(tracker.status);
          resTracker.description.should.equal(tracker.description);
          resTracker.notes.should.equal(tracker.notes);
          resTracker.tallyMarks.should.deep.equal(tracker.tallyMarks);
        });
    });
  });

  describe("POST endpoint", function() {
    const expectedKeys = [
      "id",
      "userId",
      "name",
      "description",
      "status",
      "notes",
      "tallyMarks"
    ];

    it("create a new tracker", function() {
      const newTracker = trackerFactory.createBlank();
      return chai
        .request(app)
        .post(`/api/users/${testUser._id}/trackers`)
        .set("Authorization", `Bearer ${mockJwt}`)
        .send(newTracker)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.include.keys(expectedKeys);
          res.body.name.should.equal(newTracker.name);
          res.body.id.should.not.be.null;
          res.body.description.should.equal(newTracker.description);
          res.body.status.should.equal(1);
          res.body.notes.should.equal(newTracker.notes);
        });
    });

    it("change tracker status to archived", function() {
      const updateData = { status: 2 };
      return Tracker.findOne({ status: 1 })
        .then(tracker => {
          updateData.id = tracker._id;
          return chai
            .request(app)
            .post(`/api/users/${testUser._id}/trackers/${tracker._id}/archive`)
            .set("Authorization", `Bearer ${mockJwt}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(200);
          return Tracker.findById(updateData.id);
        })
        .then(tracker => {
          tracker.status.should.equal(updateData.status);
        });
    });
  });

  describe("PUT endpoint", function() {
    // Strategy:
    // 1. Get an existing tracker from database
    // 2. Make PUT request to modify the tracker
    // 3. Check that tracker in database has been modified

    it("modify tracker fields - name, description, and notes", function() {
      const updateData = {
        name: "modify tracker name",
        description: "modify tracker description",
        notes: "modify tracker notes"
      };

      return (
        Tracker
          //find an active tracker
          .findOne({ status: 1 })
          .then(tracker => {
            updateData.id = tracker._id;
            return chai
              .request(app)
              .put(`/api/users/${testUser._id}/trackers/${tracker.id}`)
              .set("Authorization", `Bearer ${mockJwt}`)
              .send(updateData);
          })
          .then(res => {
            res.should.have.status(204);
            return Tracker.findById(updateData.id);
          })
          .then(tracker => {
            tracker.name.should.equal(updateData.name);
            tracker.description.should.equal(updateData.description);
            tracker.notes.should.equal(updateData.notes);
          })
      );
    });
  });
});
