'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { getAllUsers, createNewUser } = require('./user.controller');
const router = express.Router(); 

router.use(bodyParser.json());

//get all users
router.get('/user', getAllUsers);

//create new user 
router.post('/user', createNewUser);

//update user
// router.put('/user/:userId,')

//delete user 
//router.get('/user/:userId', )

