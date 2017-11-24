'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { getAllUsers, createNewUser, deleteUser } = require('./user.controller');
const router = express.Router(); 

router.use(bodyParser.json());

// get all users
router.get('/user', getAllUsers);

// create new user 
router.post('/user', createNewUser);

// delete user 
router.get('/user/:userId', deleteUser);

//update user
// router.put('/user/:userId,')

module.exports = router; // does this need to be different from user?