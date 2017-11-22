const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const faker = require('faker');

const mongoose = require('mongoose');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const trackerFactory = require('../test/factories/tracker.factory');

function tearDownDb() {
  return new Promise ((resolve, reject) {
    console.warn('deleting test database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}

describe('trackers', function() {
  //let mockUser; 

  // start the server before test
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  // close the server after the test is done
  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    //create trackers
    return trackerFactory.createMany();
  }); 

  afterEach(function () {
    //remove db after each test
    return tearDownDb();
  });

  //descirbe is a test case 
  //it is one test case 

  describe('trackers-endpoints', function() {
    
    })
})




trackerFactory.createOne();
// make HTTP requests to API using test client
// add mark
// remove mark
// modify name, description, notes
// archive tracker
// reactivate tracker
// delete...? (this is not added yet)
// inspect state of db after each request is made
// tear down the database