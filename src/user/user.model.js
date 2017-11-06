'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema ({
  name : {
    firstName: String,
    lastName: String,
    },
  userName: String,
  password: String,
  trackerIds: //how to handle?
});


userSchema.virtual('name').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`.trim();
});

//what is the purpose of this method?
userSchema.methods.toClient = function () {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    password: this.password,
    trackerIds: this.trackerIds
  };
}

const User = mongoose.model('User', userSchema);

module.exports = { User };