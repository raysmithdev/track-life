const { User } = require('./user.model');

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

// CREATE NEW USER
const createNewUser = (req, res) => {
  User
    .create({
      userName: req.body.userName,
      password: req.body.password,
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