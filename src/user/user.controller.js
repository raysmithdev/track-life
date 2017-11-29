const { User } = require('./user.model');
const { Tracker } = require('./tracker.model');

// GET ALL USERS
const getAllUsers = (req, res) => {
  User
    .find()
    .then(users => {
      res.json({
        users: users.map(users => users.toClient())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error"});
    });
};

// CRETE NEW USER
const createNewUser = (req, res) => {
  User
    .create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      password: req.body.password,
      avatar: req.body.avator,
      trackerIds: req.body.trackerIds
    })
    .then(user => {
      res.status(201).json(user.toClient())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error" });        
    });
};

module.exports = {
  getAllUsers,
  createNewUser,
}