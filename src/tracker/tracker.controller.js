'use strict';

const { Tracker } = require('./tracker.model');
const { User } = require('../user/user.model');
const ObjectId = require('mongodb');
const moment = require('moment');
const TrackerStatuses = require('./tracker-status.enum');

//get all existing trackers from user
// (dashboard & summary display)
const findAllTrackers = (req, res) => {
  
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

//create a new tracker -- get user by id and add
const createNewTracker = (req, res) => {
  const tallyMarks = {};
  tallyMarks[moment().format('YYYY-MM-01')] = 1;
  Tracker
    .create({
      name: req.body.name,
      description: req.body.description,
      status: TrackerStatuses.ACTIVE, 
      createdDate: new Date(),
      notes: req.body.notes,
      userId: req.params.userId, //how to handle this?
      tallyMarks
    })
    .then(tracker => {
      res.status(201).json(tracker.toClient())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error"});        
    });
};

//add mark to a tracker (update by id)
const addMark = (req, res) => {
  Tracker
    //query for tracker by id
    .findById(req.params.trackerId)
    //check if it's the current month, then increment by 1
    .then(tracker => { 
      const currentMonth = moment();
      const sortedKeys = Object.keys(tracker.tallyMarks).sort();
      const trackerMonth = sortedKeys[sortedKeys.length - 1];
      const trackerMoment = moment(trackerMonth);
  
      const doesCurrentMonthMatch = trackerMoment.isSame(currentMonth, "month");
      if (doesCurrentMonthMatch === true) {
        tracker.tallyMarks[trackerMonth]++
      } else {
      //if it is not current month, add new month & add 1 mark
        tracker.tallyMarks[currentMonth.format('YYYY-MM-01')] = 1;
      }
    tracker.save(); 
    })
    .then(tracker => {
      //return the whole tracker 
      res.status(201).json(tracker.toClient())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error"});        
    });
}
//remove a mark to a tracker (update by id)

//modify description (update by id)

//modify notes (update by id)

//archive tracker (change status by id)
const archiveTracker = (req, res) => {
  const trackerId = '';
  Tracker
    .findByIdAndUpdate()
}
//reactivate archived tracker (change status by id)

//delete tracker 

module.exports = {
  createNewTracker,
  findAllTrackers,
  addMark
};


// tracker code needs to go into that then of the User.findById statement.  
// don't set the res.json yet because you have to finish your logic 
// and then set it when you're done, you can't send the response twice

// user.trackerIds.find((tracker) => tracker._id === req.params.trackerId)

//get single tracker -- query the tracker then query the user 
/*const findOneTracker = (req, res) => {
  const trackerId = req.params.trackerId; //is this correct?
  const userId= req.params.userId;
  // const userTrackers = req.
  //return the array of trackerIds from user model -- look up the code paths 
  //linking 2 models together 
  User
    .findById(userId)
    //.populate(user.trackerIds)
    .then(user => {
      const foundId = user.trackerIds.find(id => id.equals(new ObjectId(trackerId)));
      //res.json(user.toClient());
    })
    console.log(user);

  Tracker
    .findById(trackerId)
    .then(tracker => {
      res.json(tracker.toClient());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error"});        
    });
}*/