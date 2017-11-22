const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const faker = require('faker');

const mongoose = require('mongoose');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { Trackers } = require('../src/tracker/tracker.model');
const trackerFactory = require('../test/factories/tracker.factory');

chai.use(chaiHttp);

// deletes entire database
function tearDownDb() {
  return new Promise ((resolve, reject) => {
    console.warn('deleting test database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}

// insert random trackers in database
function seedTrackerData() {
  console.info(`seeding trackers`);
  const seedData = [];
  seedData.push(trackerFactory.createMany(6));
  // console.log(seedData.push(trackerFactory.createMany(6)));
  return Trackers.insertMany(seedData); //or insert one? 
}


describe('tracker api', function() {
  //let mockUser - need to incorporate user; 

  // start the server before test
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedTrackerData();
  }); 

  //remove db after each test
  afterEach(function () {
    return tearDownDb();
  });

  // close the server after the test is done
  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() { 
    // Strategy: 
    // 1. get back all trackers returned by GET request to url
    // 2. check res has correct status & data type
    // 3. check number of trackers returned is equal to number in database
    // 4. check if returned trackers have correct keys
    // 5. check if individaul trackers have correct values 
      
    //need createdDate? userId?
    const expectedKeys = ['id', 'userId', 'name', 'description', 'status', 'notes', 'tallyMarks'];
    //should this be to specific user or all trackers in database? 
    it('should return all existing trackers', function() {
      let res;
      return chai
        .request(app)
        //replace :userId after it is set up
        .get('/users/123/trackers') 
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);
          return Trackers.count();
        })
        .then(count => {
          res.body.should.have.count.of(count);
        });
    });

    it('trackers should return with expected keys', function() {
      let resTracker; 
      return chai
        .request(app)
        .get('/users/123/trackers')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);
          // check each response for expected keys
          res.body.forEach(function (tracker) {
            tracker.should.be.a('object');
            tracker.should.include.keys(expectedKeys);
          })
          // retrieve individual trackers & check for correct values 
          resTracker = res.body[0];
          return Trackers.findById(resTracker.id);
        })
        .then(function(tracker) {
          resTracker.name.should.equal(tracker.name);
          resTracker.status.should.equal(tracker.status);
          resTracker.description.should.equal(tracker.description);
          resTracker.notes.should.equal(tracker.notes);
          resTracker.tallyMarks.should.equal(tracker.tallyMarks);
        });
      });
    });

    //are these needed? 
    // it('should return all active trackers', function() { });
    // it('should return all archived trackers', function() { });
  });

  describe('POST endpoint', function() { 
    it('be able to add one mark to a tracker', function() {
      
    });
    it('be able to remove one mark to a tracker', function() {
      
    });
    it('change tracker status to archived', function() {

    });

    //is this needed? 
    // it('change tracker status to active (reactivated)', function() {
      
    // });
  });

  describe('PUT endpoint', function() {
    it('modify tracker fields - name, description, and notes', function() {
      
    });
  });

  describe('DELETE endpoint', function() {
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