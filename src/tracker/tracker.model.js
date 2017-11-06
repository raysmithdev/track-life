'use strict';

const mongoose = require('mongoose');

const trackerSchema = mongoose.Schema ({
  name: {type: String, required: true},
  description: String,
  status: Number, 
  createdDate: {type: Date, default: new Date()},
  notes: String,
  tallyMarks: mongoose.Schema.Types.Mixed
});

trackerSchema.methods.toClient = function() {
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