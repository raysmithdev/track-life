'use strict';

const express = require('express');
const bodyParser = require('body-parser');
//const {Tracker} = require('./tracker.model');
const {addMark, createNewTracker, findAllTrackers} = require('./tracker.controller');
const router = express.Router(); 

router.use(bodyParser.json());
//router.get('/', );

// router.get('/trackers', )
// router.get('/trackers/:trackerId', ) //query with user id?

//router.get('/user', )
//router.get('/user/:userId', )

//get all trackers from user
router.get('/users/:userId/trackers', findAllTrackers)

//access individual tracker -- modify as needed
//router.get('/users/:userId/trackers/:trackerId',)

//create new tracker
router.post('/users/:userId/trackers', createNewTracker);

//add mark - increment by 1
router.post('/users/:userId/trackers', addMark)

//modify tracker to add a mark to it
//how to attach this to Add Mark button?
router.put('/users/:userId/trackers', addMark)
//archive a tracker
//router.put('/users/:userId/trackers/:trackerId', )

module.exports = router;