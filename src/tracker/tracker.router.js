'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {Tracker} = require('./tracker.model');

const router = express.Router(); 


router.get('/', );

// router.get('/trackers', )
// router.get('/trackers/:trackerId', ) //query with user id?

router.get('/user', )

router.get('/user/:userId', )

//get all trackers from user
router.get('/users/:userId/trackers', )

//access individual tracker -- modify as needed
router.get('/users/:userId/trackers/:trackerId', )

//create new tracker
router.post('/users/:userId/trackers', )

