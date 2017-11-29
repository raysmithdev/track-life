'use strict';

const mongoose = require('mongoose');

const trackerSchema = mongoose.Schema ({
  userId: String,
  name: {type: String, required: true},
  description: String,
  status: Number, 
  // when server starts & mongoose initiates schema, 
  // if default: new Date() then entire database is set to this date
  // create new Date() when tracker is created instead
  createdDate: {type: Date, required: true}, 
  notes: String,
  tallyMarks: mongoose.Schema.Types.Mixed
});

trackerSchema.methods.toClient = function() {
  return {
    id: this._id,
    userId: this.userId, //?
    name: this.name,
    description: this.description,
    status: this.status,
    createdDate: this.createdDate,
    notes: this.notes,
    tallyMarks: this.tallyMarks
  };
}

const Tracker = mongoose.model('Tracker', trackerSchema);

module.exports = { Tracker };