'use strict';

const { Tracker } = require('./tracker.model');
const { User } = require('../user/user.model');
const ObjectId = require('mongodb');
const moment = require('moment');
const TrackerStatuses = require('./tracker-status.enum');

//get all existing trackers from user
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
  const requiredFields = ['name', 'userId'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if(! (field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const tallyMarks = {};
  //confirm if format to 01 as DD is okay
  tallyMarks[moment().format('YYYY-MM-01')] = 1;
  Tracker
    .create({
      name: req.body.name,
      description: req.body.description,
      status: TrackerStatuses.ACTIVE, 
      createdDate: new Date(),
      notes: req.body.notes,
      //how is userId saved when tracker is created? 
      userId: req.params.userId, 
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
  if (!(req.params.trackerId && req.body.trackerId === req.body.trackerId)) {
    res.status(400).json({
      error: `Request path id and request body id values must match`
    });
  }

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

//update fields within tracker (name, description, notes)
const modifyTrackerDetails = (req, res) => {
  if (!(req.params.trackerId && req.body.trackerId === req.body.trackerId)) {
    res.status(400).json({
      error: `Request path id and request body id values must match`
    });
  }

  const updated = {};
  const updateableFields = ['name', 'description', 'notes'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Tracker
    .findByIdAndUpdate(req.params.trackerId, {$set: updated}, {new: true})
    .then(updatedTracker => res.status(204).end()) //?
    .catch(err => res.status(500).json({message: `tracker couldn't be updated`}));
};

//archive tracker (change status by id)
const archiveTracker = (req, res) => {
  const updateField = ['status'];
  // const trackerId = ''; //is this needed?
  Tracker
    .findByIdAndUpdate(req.params.trackerId)
    .then()
}

//reactivate archived tracker (change status by id)

//delete tracker 

module.exports = {
  addMark,
  createNewTracker,
  findAllTrackers,
  modifyTrackerDetails
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