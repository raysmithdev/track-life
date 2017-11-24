const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./tracker.controller')
const router = express.Router(); 

router.use(bodyParser.json());

// get all trackers from user
router.get('/users/:userId/trackers', controller.findAllTrackers)

// get active trackers from user
router.get('/users/:userId/trackers/active', controller.findActiveTrackers)

// get archived trackers from user
router.get('/users/:userId/trackers/archived', controller.findArchivedTrackers)

// create new tracker
router.post('/users/:userId/trackers', controller.createNewTracker);

// add mark to an existing tracker (increment by 1)
router.post('/users/:userId/trackers/:trackerId/increment', controller.addMark)

// remove mark from an existing tracker (decrement by 1)
router.post('/users/:userId/trackers/:trackerId/decrement', controller.removeMark)

// modify tracker details (name, description, notes)
router.put('/users/:userId/trackers/:trackerId', controller.modifyTrackerDetails)

// archive tracker (change status code)
router.post('/users/:userId/trackers/:trackerId/archive', controller.archiveTracker)

// reactivate archived tracker (change status code)
router.post('/users/:userId/trackers/:trackerId/reactivate', controller.reactivateTracker)

// soft delete tracker
router.post('/users/:userId/trackers/:trackerId/delete', controller.deleteTrackerSoft)

// hard delete tracker
router.delete('/users/:userId/trackers/:trackerId/', controller.deleteTrackerPerm)

module.exports = router;