'use strict';

const mongoose = require('mongoose');

const trackerSchema = mongoose.Schema ({
  name: String,
  description: String,
  status: Number, 
  createdDate: Date,
  notes: String,
  tallyMarks: {
    'YYYY-MM-DD': Number
  }
});

//what is the purpose of this method?
trackerSchema.methods.toClient = function () {
  return {
    id: this._id,
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