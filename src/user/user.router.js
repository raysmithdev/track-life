const express = require('express');
const bodyParser = require('body-parser');
const { getAllUsers, createNewUser, deleteUser } = require('./user.controller');
const router = express.Router(); 

router.use(bodyParser.json());

// get all users
router.get('/users', getAllUsers);

// create new user 
router.post('/users', createNewUser);

// delete user 
router.get('/users/:userId', deleteUser);

//update user
// router.put('/user/:userId,')

module.exports = router; // does this need to be different from user?