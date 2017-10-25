'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

const should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('index page', function() {
  it('index page exists', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });
});