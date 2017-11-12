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

//get all existing active trackers from user
const findActiveTrackers = (req, res) => {
  Tracker
    .find({ 'status' : 1 })
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

//get all archived trackers from user
const findArchivedTrackers = (req, res) => {
  Tracker
    .find({ 'status' : 2 })
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
  // console.log(req.params);
  const trackerId = req.params.trackerId;
  Tracker
    //query for tracker by id
    .findById(trackerId)
    //check if it's the current month, then increment by 1
    .then(tracker => { 
      if(!tracker) res.status(400).json({message: 'Tracker Not Found'});
      const currentMonth = moment();
      const sortedKeys = Object.keys(tracker.tallyMarks).sort();
      const trackerMonth = sortedKeys[sortedKeys.length - 1];
      const trackerMoment = moment(trackerMonth);
  
      const doesCurrentMonthMatch = trackerMoment.isSame(currentMonth, "month");
      if (doesCurrentMonthMatch === true) {
        tracker.tallyMarks[trackerMonth] = tracker.tallyMarks[trackerMonth] + 1;
      } else {
      //if it is not current month, add new month & add 1 mark
        tracker.tallyMarks[currentMonth.format('YYYY-MM-01')] = 1;
      }
      tracker.markModified('tallyMarks');
      return tracker.save();
    // return tracker.save((err, trkr) => console.log('updated tracker -> ', trkr)); 
    })
    .then(tracker => {
      //return the whole tracker 
      res.status(201).json(tracker.toClient())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error: " + err.message});        
    });
}

//remove a mark to a tracker (update by id)
const removeMark = (req, res) => {
  const trackerId = req.params.trackerId;
  Tracker
    //query for tracker by id
    .findById(trackerId)
    //check if it's the current month, then increment by 1
    .then(tracker => { 
      if(!tracker) res.status(400).json({message: 'Tracker Not Found'});
      const currentMonth = moment();
      const sortedKeys = Object.keys(tracker.tallyMarks).sort();
      const trackerMonth = sortedKeys[sortedKeys.length - 1];
      const trackerMoment = moment(trackerMonth);
  
      const doesCurrentMonthMatch = trackerMoment.isSame(currentMonth, "month");
      if (doesCurrentMonthMatch === true) {
        tracker.tallyMarks[trackerMonth] = tracker.tallyMarks[trackerMonth] - 1;
        }
        // } else {
      // //if it is not current month, delete the month
      //   tracker.tallyMarks[currentMonth.format('YYYY-MM-01')] = 1;
      // }
      tracker.markModified('tallyMarks');
      return tracker.save();
    })
    .then(tracker => {
      //return the whole tracker 
      res.status(201).json(tracker.toClient())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error: " + err.message});        
    });
}

//update fields within tracker (name, description, notes)
//? - figure out how to render name & description fields
const modifyTrackerDetails = (req, res) => {
  const trackerId = req.params.trackerId;
  const updated = {};
  const updateableFields = ['name', 'description', 'notes'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Tracker
  .findByIdAndUpdate(trackerId, {$set: updated}, {new: true})
  .then(updatedTracker => 
    res.status(204).end()) 
  .catch(err => 
    res.status(500).json({message: `tracker couldn't be updated`}));
};

//archive tracker (change status by id)
const archiveTracker = (req, res) => {
  const trackerId = req.params.trackerId;
  const updateStatus = { $set: { status: 2 }}; 

  Tracker
    .findByIdAndUpdate(trackerId, updateStatus, {new: true})
      .then(tracker => 
        res.status(200).json(tracker.toClient()).end())
      .catch(err => 
        res.status(500).json({message: `tracker couldn't be archived`}));
}

//reactivate archived tracker (change status by id)
const reactivateTracker = (req, res) => {
  const trackerId = req.params.trackerId;
  const updateStatus = { $set: { status: 1 }}; 
  
    Tracker
      .findByIdAndUpdate(trackerId, updateStatus, {new: true})
        .then(tracker => 
          res.status(200).json(tracker.toClient()).end())
        .catch(err => 
          res.status(500).json({message: `tracker couldn't be reactivated`}));
}

//delete tracker 
const deleteTracker = (req, res) => {
  const trackerId = req.params.trackerId;

  Tracker
    .findByIdAndUpdate(trackerId)
    .then(tracker => {
      tracker.set({ status: 3 });
      res.status(204).end()
    })
    .catch(err => 
      res.status(500).json({message: `tracker couldn't be archived`}));
}

module.exports = {
  addMark,
  archiveTracker,
  createNewTracker,
  deleteTracker,
  findActiveTrackers,
  findArchivedTrackers,
  findAllTrackers,
  modifyTrackerDetails,
  reactivateTracker,
  removeMark
};


// tracker code needs to go into that then of the User.findById statement.  
// don't set the res.json yet because you have to finish your logic 
// and then set it when you're done, you can't send the response twice


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