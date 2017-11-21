const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const faker = require('faker');

const mongoose = require('mongoose');
const { runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const trackerFactory = require('../test/factories/tracker.factory');

//steps to run test
// connect to database 
// seed fake data to database - trackers
describe('trackers', function() {
  //let mockUser; 
  before(function() {

  })
  beforeEach // only when you want a new set of data
  after
  afterEach //
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