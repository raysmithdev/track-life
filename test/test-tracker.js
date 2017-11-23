const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { Tracker } = require('../src/tracker/tracker.model');
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
  const seedData = trackerFactory.createMany(5);
  // console.log('seedData ->', seedData);
  //this puts it into the database
  return Tracker.insertMany(seedData);
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
    it('return all existing trackers', function() {
      let res;
      return chai
        .request(app)
        //replace :userId after it is set up
        .get('/api/users/123/trackers') 
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          // console.log('get all trackers->', res.body.trackers);
          res.body.trackers.should.have.lengthOf.at.least(1);
          return Tracker.count();
        })
        .then(count => {
          res.body.trackers.should.have.lengthOf(count);
        });
    });

    it('trackers should return with expected keys', function() {
      let resTracker; 
      return chai
        .request(app)
        .get('/api/users/123/trackers')
        .then(function(res) {
          // console.log('res for expected keys->', res)
          res.should.have.status(200);
          res.should.be.json;
          res.body.trackers.should.be.a('array');
          res.body.trackers.should.have.lengthOf.at.least(1);
          // check each response for expected keys
          res.body.trackers.forEach(function (tracker) {
            tracker.should.be.a('object');
            tracker.should.include.keys(expectedKeys);
          })
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

    //are these needed? 
    it('return trackers with active status', function() { 
      let resTracker; 
      return chai
        .request(app)
        .get('/api/users/123/trackers/active')
        .then(function(res) {
          // console.log('res for expected keys->', res)
          res.should.have.status(200);
          res.should.be.json;
          res.body.trackers.should.be.a('array');
          res.body.trackers.should.have.lengthOf.at.least(1);
          // check each response for expected keys
          res.body.trackers.forEach(function (tracker) {
            tracker.should.be.a('object');
            tracker.should.include.keys(expectedKeys);
          })
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

    it('return trackers with archive status', function() {
      let resTracker; 
      return chai
        .request(app)
        .get('/api/users/123/trackers/archived')
        .then(function(res) {
          // console.log('res for expected keys->', res)
          res.should.have.status(200);
          res.should.be.json;
          res.body.trackers.should.be.a('array');
          res.body.trackers.should.have.lengthOf.at.least(1);
          // check each response for expected keys
          res.body.trackers.forEach(function (tracker) {
            tracker.should.be.a('object');
            tracker.should.include.keys(expectedKeys);
          })
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
  });

  describe('POST endpoint', function() { 
    const expectedKeys = ['id', 'userId', 'name', 'description', 'status', 'notes', 'tallyMarks'];
    //Strategy:
    // 1. make post request (add mark)
    // 2. check that post has right keys 
    // 3. check that post has right id 
    it('create a new tracker', function() { 
      const newTracker = trackerFactory.newTracker;
      return chai
        .request(app)
        //change user 
        .post('/api/users/123/trackers')
        .send(newTracker)
        .then(function(res) {
          // console.log('create new tracker res->', res);
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(expectedKeys);
          res.body.name.should.equal(newTracker.name);
          res.body.id.should.not.be.null;
          res.body.description.should.equal(newTracker.description);
          res.body.status.should.equal(1);
          res.body.notes.should.equal(newTracker.notes);
          // res.body.tallyMarks.should.deep.equal(newTracker.tallyMarks);
        })
    });
    
    it('be able to add one mark to a tracker', function() {
      // return chai
      //   .request(app)
      //   .post('')
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