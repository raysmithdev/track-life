const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const { DATABASE_URL, PORT } = require('./config');


const authRouter = require('./src/auth/auth.routes');

const TrackerRouter = require('./src/tracker/tracker.router');
const { jwtStrategy } = require('./src/auth/auth.strategies');

// create new express app
const app = express(); 

// use these middleware for the app
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(passport.initialize());
passport.use(jwtStrategy);

mongoose.Promise = global.Promise;

// establish root
app.use(express.static('public'));

// establish /api/routers 
app.use('/api', TrackerRouter); 
app.use('/api/auth', authRouter);

// establish dashboard path 
// when request to dashboard is made, check for dashboard
app.get('/dashboard', (req, res) => {
  res.status(200).sendFile(__dirname + '/public/dashboard.html');
});

// if in root, get index
app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/public/index.html');
});

let server; 

// connect to mongo database & start the express server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
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

// close the express server
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