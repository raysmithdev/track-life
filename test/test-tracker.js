const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const faker = require('faker');

const mongoose = require('mongoose');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

const trackerFactory = require('../test/factories/tracker.factory');

function tearDownDb() {
  return new Promise ((resolve, reject) => {
    console.warn('deleting test database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}

describe('tracker api', function() {
  //let mockUser - need to incorporate user; 

  // start the server before test
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    //create trackers
    return trackerFactory.createMany();
  }); 

  afterEach(function () {
    //remove db after each test
    return tearDownDb();
  });

  // close the server after the test is done
  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() { 
    it('should return all existing trackers', function() {
      
    });
    it('should return all active trackers', function() {
      
    });
    it('should return all archived trackers', function() {
      
    });
  });

  describe('POST endpoint', function() { 
    it('be able to add one mark to a tracker', function() {
      
    });
    it('be able to remove one mark to a tracker', function() {
      
    });
    it('change tracker status to archived', function() {

    });
    it('change tracker status to active (reactivated)', function() {
      
    });
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