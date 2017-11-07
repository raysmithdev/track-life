'use strict';

//object? is this the correct filepath? 
const {Tracker} = require('./tracker.model');
const {User} = require('../user/user.model');

//get all existing trackers from user (dashboard & summary display)
const getAllTrackers = (req, res) => {
  Tracker
    .find()
    .then(trackers => {
      res.json({
        trackers: trackers.map(trackers => trackers.toClient())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error"});
    });
};

//get single tracker from user (by id) - individual summary display

//create a new tracker -- get user by id and add
const createNewTracker = (req, res) => {
  Tracker
    .create({
      name: req.body.name,
      description: req.body.description,
      notes: req.body.notes,
    })
    .then()
}

//add mark to a tracker (update by id)

//remove a mark to a tracker (update by id)

//modify description (update by id)

//modify notes (update by id)

//archive tracker (change status by id)

//reactivate archived tracker (change status by id)

//delete tracker 