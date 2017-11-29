const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const jwt = require('jsonwebtoken');
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
  // console.log('new test user before db ->', testUser);
  return User.create(testUser);
};

// insert random trackers in database
function seedTrackerData(userId) {
  console.info(`seeding trackers`);
  const seedData = trackerFactory.createMany(userId, 10);
  //this puts it into the database
  return Tracker.insertMany(seedData);
}

const createAuthToken = user => {
  // console.log('auth token->', user); 
  return jwt.sign( { user }, JWT_SECRET, {
    subject: user.userName, 
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
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
    // console.log('get user id before each ->', testUser._id);
    mockJwt = createAuthToken(testUser);
    // console.log('jwt? ->', mockJwt);
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
    // console.log('user info before first it statement ->', testUser);
    // console.log('jwt before first it statement ->', mockJwt);
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
      return (
        chai
          .request(app)
          .get(`/api/users/${testUser._id}/trackers`)
          .set('Authorization', `Bearer ${mockJwt}`)
          .then(_res => {
            // console.log('res ->', _res);
            res = _res;
            // console.log('status ->', res.status);
            res.should.have.status(200);
            // console.log('get all trackers->', res.body);
            res.body.trackers.should.have.lengthOf.at.least(1);
            // console.log('one tracker obj ->', res.body.trackers[0].tallyMarks);
            return Tracker.count();
          })
          .then(count => {
            res.body.trackers.should.have.lengthOf(count);
          })
      );
    });

    it("trackers should return with expected keys", function() {
      let resTracker;
      return chai
        .request(app)
        .get(`/api/users/${testUser._id}/trackers`)
        .set('Authorization', `Bearer ${mockJwt}`)
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

    it("return trackers with active status", function() {
      let resTracker;
      return chai
        .request(app)
        .get(`/api/users/${testUser._id}/trackers/active`)
        .set('Authorization', `Bearer ${mockJwt}`)
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
        .set('Authorization', `Bearer ${mockJwt}`)
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
      return (
        chai
          .request(app)
          //change user
          .post(`/api/users/${testUser._id}/trackers`)
          .set('Authorization', `Bearer ${mockJwt}`)
          .send(newTracker)
          .then(function(res) {
            // console.log('create new tracker res->', res);
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.should.include.keys(expectedKeys);
            res.body.name.should.equal(newTracker.name);
            res.body.id.should.not.be.null;
            res.body.description.should.equal(newTracker.description);
            res.body.status.should.equal(1);
            res.body.notes.should.equal(newTracker.notes);
          })
      );
    });

      it("change tracker status to archived", function() {
        const updateData = { status: 2 };
        return Tracker
          .findOne({ status: 1 })
          .then(tracker => {
            updateData.id = tracker._id;
            return chai
              .request(app)
              .post(`/api/users/${testUser._id}/trackers/${tracker._id}/archive`)
              .set('Authorization', `Bearer ${mockJwt}`)
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

    /*
    it("add one mark to a tracker", function() {
      const updateData = { status: 2 };
      return Tracker
        .findOne({ status: 1 })
        .then(tracker => {
          updateData.id = tracker._id;
        //store the returned tracker's tallymark value 
        //need to access the object key and value 
        //what is the difference between return tracker and return chai?
          return chai
            .request(app)
            .post(`/api/users/123/trackers/${tracker.id}/increment`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return Tracker.findById(updateData.id);
        })
        .then(tracker => {
          //how to 
          // tracker.status.should.equal(updateData.status);
        });
      });

    // it('change tracker status to active (reactivated)', function() {});
    // it("remove one mark to a tracker", function() {});
*/

  describe("PUT endpoint", function() {
    // Strategy: 
    // 1. Get an existing tracker from database
    // 2. Make PUT request to modify the tracker
    // 3. Check that tracker in database has been modified

    it("modify tracker fields - name, description, and notes", function() {
      const updateData = {
        name: 'modify tracker name',
        description: 'modify tracker description',
        notes: 'modify tracker notes'
      };

      return Tracker
        //find an active tracker
        .findOne({status: 1})
        .then(tracker => {
          updateData.id = tracker._id;
          // console.log('find one tracker ->', tracker);
          return chai
            .request(app)
            .put(`/api/users/${testUser._id}/trackers/${tracker.id}`)
            .set('Authorization', `Bearer ${mockJwt}`)
            .send(updateData);
        })
        .then(res => {
          // console.log('after put request, what is res ->', res);
          res.should.have.status(204);
          return Tracker.findById(updateData.id);
        })
        .then(tracker => {
          tracker.name.should.equal(updateData.name);
          tracker.description.should.equal(updateData.description);
          tracker.notes.should.equal(updateData.notes);
        });
      });
  });

  describe("DELETE endpoint", function() {
    //not sure if this will happen or not yet
  });
});
//trackerFactory.createOne();

// make HTTP requests to API using test client
// add mark
// remove mark
// modify name, description, notes
// archive tracker
// reactivate tracker
// delete...? (this is not added yet)
// inspect state of db after each request is made
// tear down the database
