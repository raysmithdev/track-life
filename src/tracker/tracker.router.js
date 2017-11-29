const express = require("express");
const bodyParser = require("body-parser");
const controller = require("./tracker.controller");
const passport = require("passport");
const router = express.Router();

router.use(bodyParser.json());

// GET ALL TRACKERS FROM USER
router.get(
  "/users/:userId/trackers",
  passport.authenticate("jwt", { session: false }),
  controller.findAllTrackers
);

// GET ACTIVE TRACKERS FROM USER
router.get(
  "/users/:userId/trackers/active",
  passport.authenticate("jwt", { session: false }),
  controller.findActiveTrackers
);

// GET ARCHIVED TRACKERS FROM USER
router.get(
  "/users/:userId/trackers/archived",
  passport.authenticate("jwt", { session: false }),
  controller.findArchivedTrackers
);

// CREATE NEW TRACKER
router.post(
  "/users/:userId/trackers",
  passport.authenticate("jwt", { session: false }),
  controller.createNewTracker
);

// ADD MARK TO EXISTING TRACKER (increment by 1)
router.post(
  "/users/:userId/trackers/:trackerId/increment",
  passport.authenticate("jwt", { session: false }),
  controller.addMark
);

// REMOVE MARK FROM EXISTING TRACKER (decrement by 1)
router.post(
  "/users/:userId/trackers/:trackerId/decrement",
  passport.authenticate("jwt", { session: false }),
  controller.removeMark
);

// MODIFY TRACKER DETAILS(name, description, notes)
router.put(
  "/users/:userId/trackers/:trackerId",
  passport.authenticate("jwt", { session: false }),
  controller.modifyTrackerDetails
);

// ARCHIVE TRACKER (change status code)
router.post(
  "/users/:userId/trackers/:trackerId/archive",
  passport.authenticate("jwt", { session: false }),
  controller.archiveTracker
);

// REACTIVATE ARCHIVED TRACKER (change status code)
router.post(
  "/users/:userId/trackers/:trackerId/reactivate",
  passport.authenticate("jwt", { session: false }),
  controller.reactivateTracker
);

// SOFT DELETE TRACKER
router.post(
  "/users/:userId/trackers/:trackerId/delete",
  passport.authenticate("jwt", { session: false }),
  controller.deleteTrackerSoft
);

// HARD DELETE TRACKER
router.delete(
  "/users/:userId/trackers/:trackerId/",
  passport.authenticate("jwt", { session: false }),
  controller.deleteTrackerPerm
);

module.exports = router;
