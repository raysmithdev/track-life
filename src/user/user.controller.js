const { User } = require('./user.model');
const { Tracker } = require('./tracker.model');

// get all users
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

// create a new user
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

// delete user
const deleteUser = (req, res) => {
  const userId = req.params.id;
  /*
    * first find the user so you can get the tracker ids store in variable trackerIds
    * remove user, in the then() find trackers by the ids you got from the user and remove theme
    * query {_id : {$in : trackerIds}} - actually delete or change status to 3 (delete)
  */
  User
    //find user
    //store the trakcers in an id  >> d
    .findByIdAndRemove(userId) // see f mongoose has option to return record
    .then((user) => { //check to see if this will return the user record deleted
      Tracker.findByIdAndRemove()
      res.status(204).json({ message: 'successful deletion of user' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "internal server error" }); 
    });
};

module.exports = {
  getAllUsers,
  createNewUser,
  deleteUser
}