'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const { DATABASE_URL, PORT } = require('./config');

const TrackerRouter = require('./src/tracker/tracker.router');

//creating new express app
const app = express(); 

//use these middleware for the app
app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

//https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use('/api', TrackerRouter); //why api

//establish dashboard path 
app.get('/dashboard',  (req, res) => {
  res.status(200).sendFile(__dirname + '/public/dashboard.html');
})

let server; 

//connect to mongo database & start the express server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`App is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => { 
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = { runServer, app, closeServer };