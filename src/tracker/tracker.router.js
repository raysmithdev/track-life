const express = require("express");
const bodyParser = require("body-parser");
const controller = require("./tracker.controller");
const passport = require("passport");
const router = express.Router();

router.use(bodyParser.json());

// get all trackers from user
router.get(
  "/users/:userId/trackers",
  passport.authenticate("jwt", { session: false }),
  controller.findAllTrackers
);

// get active trackers from user
router.get(
  "/users/:userId/trackers/active",
  passport.authenticate("jwt", { session: false }),
  controller.findActiveTrackers
);

// get archived trackers from user
router.get(
  "/users/:userId/trackers/archived",
  passport.authenticate("jwt", { session: false }),
  controller.findArchivedTrackers
);

// create new tracker
router.post(
  "/users/:userId/trackers",
  passport.authenticate("jwt", { session: false }),
  controller.createNewTracker
);

// add mark to an existing tracker (increment by 1)
router.post(
  "/users/:userId/trackers/:trackerId/increment",
  passport.authenticate("jwt", { session: false }),
  controller.addMark
);

// remove mark from an existing tracker (decrement by 1)
router.post(
  "/users/:userId/trackers/:trackerId/decrement",
  passport.authenticate("jwt", { session: false }),
  controller.removeMark
);

// modify tracker details (name, description, notes)
router.put(
  "/users/:userId/trackers/:trackerId",
  passport.authenticate("jwt", { session: false }),
  controller.modifyTrackerDetails
);

// archive tracker (change status code)
router.post(
  "/users/:userId/trackers/:trackerId/archive",
  passport.authenticate("jwt", { session: false }),
  controller.archiveTracker
);

// reactivate archived tracker (change status code)
router.post(
  "/users/:userId/trackers/:trackerId/reactivate",
  passport.authenticate("jwt", { session: false }),
  controller.reactivateTracker
);

// soft delete tracker
router.post(
  "/users/:userId/trackers/:trackerId/delete",
  passport.authenticate("jwt", { session: false }),
  controller.deleteTrackerSoft
);

// hard delete tracker
router.delete(
  "/users/:userId/trackers/:trackerId/",
  passport.authenticate("jwt", { session: false }),
  controller.deleteTrackerPerm
);

module.exports = router;
