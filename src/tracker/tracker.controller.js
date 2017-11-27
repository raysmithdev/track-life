"use strict";

const { Tracker } = require("./tracker.model");
const { User } = require("../user/user.model");
const ObjectId = require("mongodb");
const moment = require("moment");
const TrackerStatuses = require("./tracker-status.enum");

// get all existing trackers from user
const findAllTrackers = (req, res) => {
  //need to find by id
  const userId = req.params.userId; //req.query.userId

  Tracker.find( {userId : userId} )
    .then(trackers => {
      res.json({
        trackers: trackers.map(trackers => trackers.toClient())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error" });
    });
};

// get all existing active trackers from user
const findActiveTrackers = (req, res) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };
  // console.log('userId', req.params.userId);
  Tracker.find({ userId: req.params.userId, status: 1 })
    .then(trackers => {
      res.json({
        trackers: trackers.map(trackers => trackers.toClient())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error" });
    });
};

// get all archived trackers from user
const findArchivedTrackers = (req, res) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };

  Tracker.find({ status: 2 })
    .then(trackers => {
      res.json({
        trackers: trackers.map(trackers => trackers.toClient())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error" });
    });
};

// create a new tracker -- get user by id and add
const createNewTracker = (req, res) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };

  const requiredFields = ["name", "userId"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const tallyMarks = {};
  tallyMarks[moment().format("YYYY-MM-01")] = 1;
  Tracker.create({
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
      res.status(201).json(tracker.toClient());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error" });
    });
};

// add mark to a tracker (update by id)
const addMark = (req, res) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };
  // console.log(req.params);
  const trackerId = req.params.trackerId;
  Tracker
    //query for tracker by id
    .findById(trackerId)
    //check if it's the current month, then increment by 1
    .then(tracker => {
      if (!tracker) res.status(400).json({ message: "Tracker Not Found" });
      const currentMonth = moment();
      const sortedKeys = Object.keys(tracker.tallyMarks).sort(function (a, b) {
        return Date.parse(a) > Date.parse(b); //confirm if < or >
        }); //this checks if it's being parsed as dates  

      //when sorting, need to make sure the keys are being treated as date value vs string value
      //date-fns library -- visit this for easier functions 
      //call the parse function in date-fns library
      const trackerMonth = sortedKeys[sortedKeys.length - 1];
      const trackerMoment = moment(trackerMonth);

      const doesCurrentMonthMatch = trackerMoment.isSame(currentMonth, "month");
      if (doesCurrentMonthMatch === true) {
        tracker.tallyMarks[trackerMonth] = tracker.tallyMarks[trackerMonth] + 1;
      } else {
        //if it is not current month, add new month & add 1 mark
        tracker.tallyMarks[currentMonth.format("YYYY-MM-01")] = 1;
      }
      tracker.markModified("tallyMarks");
      return tracker.save();
      // return tracker.save((err, trkr) => console.log('updated tracker -> ', trkr));
    })
    .then(tracker => {
      //return the whole tracker
      res.status(201).json(tracker.toClient());
    })
    .catch(err => {
      console.error(err);
      res
        .status(500)
        .json({ message: "internal server error: " + err.message });
    });
};

// remove a mark to a tracker (update by id)
const removeMark = (req, res) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };

  const trackerId = req.params.trackerId;
  Tracker
    //query for tracker by id
    .findById(trackerId)
    //check if it's the current month, then increment by 1
    .then(tracker => {
      if (!tracker) res.status(400).json({ message: "Tracker Not Found" });
      const currentMonth = moment();
      const sortedKeys = Object.keys(tracker.tallyMarks).sort();
      const trackerMonth = sortedKeys[sortedKeys.length - 1];
      const trackerMoment = moment(trackerMonth);

      const doesCurrentMonthMatch = trackerMoment.isSame(currentMonth, "month");
      if (doesCurrentMonthMatch === true) {
        tracker.tallyMarks[trackerMonth] = tracker.tallyMarks[trackerMonth] - 1;
      } else {
        //if it is not current month, set count to 0 so nothing will render
        tracker.tallyMarks[currentMonth.format("YYYY-MM-01")] = 0;
      }
      tracker.markModified("tallyMarks");
      return tracker.save();
    })
    .then(tracker => {
      //return the whole tracker
      res.status(201).json(tracker.toClient());
    })
    .catch(err => {
      console.error(err);
      res
        .status(500)
        .json({ message: "internal server error: " + err.message });
    });
};

// archive tracker (change status by id)
const archiveTracker = (req, res) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };

  const trackerId = req.params.trackerId;
  const updateStatus = { $set: { status: 2 } };

  Tracker.findByIdAndUpdate(trackerId, updateStatus, { new: true })
    .then(tracker =>
      res
        .status(200)
        .json(tracker.toClient())
        .end()
    )
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: `tracker couldn't be archived` })
    });
};

// reactivate archived tracker (change status by id)
const reactivateTracker = (req, res) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };

  const trackerId = req.params.trackerId;
  const updateStatus = { $set: { status: 1 } };

  Tracker.findByIdAndUpdate(trackerId, updateStatus, { new: true })
    .then(tracker =>
      res
        .status(200)
        .json(tracker.toClient())
        .end()
    )
    .catch(err => { 
      console.error(err);
      res.status(500).json({ message: `tracker couldn't be reactivated` })
    });
};

// update fields within tracker (name, description, notes)
const modifyTrackerDetails = (req, res) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };

  const trackerId = req.params.trackerId;
  const updated = {};
  const updateableFields = ["name", "description", "notes"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Tracker.findByIdAndUpdate(trackerId, { $set: updated }, { new: true })
    .then(updatedTracker => res.status(204).end())
    .catch(err =>
      res.status(500).json({ message: `tracker couldn't be deleted` })
    );
};

// delete tracker (change status to 3)
const deleteTrackerSoft = (req, res) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };

  const trackerId = req.params.trackerId;
  const updateStatus = { $set: { status: 3 } };

  Tracker.findByIdAndUpdate(trackerId, updateStatus, { new: true })
    .then(tracker =>
      res
        .status(200)
        .json(tracker.toClient())
        .end()
    )
    .catch(err => { 
      console.error(err);
      res.status(500).json({ message: `tracker couldn't be deleted - status 3` })
    });
};

// hard delete tracker (remove from database)
const deleteTrackerPerm = (req, res) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json('Not authorized');
  };
  
  const trackerId = req.params.trackerId;

  Tracker
    .findByIdAndRemove(trackerId)
    .then(() => {
      console.log(`deleted tracker: ${trackerId}`);
      res.status(204).end()
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'internal server error'});
    });     
};

module.exports = {
  addMark,
  archiveTracker,
  createNewTracker,
  deleteTrackerSoft,
  deleteTrackerPerm,
  findActiveTrackers,
  findArchivedTrackers,
  findAllTrackers,
  modifyTrackerDetails,
  reactivateTracker,
  removeMark
};

