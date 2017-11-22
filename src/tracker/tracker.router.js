'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { addMark, archiveTracker, createNewTracker, deleteTracker, findArchivedTrackers, findActiveTrackers, findAllTrackers, modifyTrackerDetails, reactivateTracker, removeMark } = require('./tracker.controller');
const router = express.Router(); 

router.use(bodyParser.json());

// get all trackers from user
router.get('/users/:userId/trackers', findAllTrackers)

// get active trackers from user
router.get('/users/:userId/trackers/active', findActiveTrackers)

// get archived trackers from user
router.get('/users/:userId/trackers/archived', findArchivedTrackers)

// create new tracker
router.post('/users/:userId/trackers', createNewTracker);

// add mark to an existing tracker (increment by 1)
router.post('/users/:userId/trackers/:trackerId/increment', addMark)

// remove mark from an existing tracker (decrement by 1)
router.post('/users/:userId/trackers/:trackerId/decrement', removeMark)

// modify tracker details (name, description, notes)
router.put('/users/:userId/trackers/:trackerId', modifyTrackerDetails)

// archive tracker (change status code)
router.post('/users/:userId/trackers/:trackerId/archive', archiveTracker)

// reactivate archived tracker (change status code)
router.post('/users/:userId/trackers/:trackerId/reactivate', reactivateTracker)

// delete tracker
// router.post('/users/:userId/trackers/:trackerId/delete', deleteTracker)

module.exports = router;

//extra routes for now 

//router.get('/', );
//access individual tracker -- modify as needed
//router.get('/users/:userId/trackers/:trackerId',)

// router.get('/trackers', )
// router.get('/trackers/:trackerId', ) //query with user id?

