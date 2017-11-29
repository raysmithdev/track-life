'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema ({

  userName: {type: String, required: true},
  password: {type: String, required: true},
  // trackerIds are redundant; already stored on tracker model
  // trackerIds: [mongoose.Schema.Types.ObjectId]
  // avatar: String,
  // firstName: String,
  // lastName: String,
});


userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.methods.toClient = function () {
  return {
    id: this._id,   
    userName: this.userName,
    trackerIds: this.trackerIds
    // firstName: this.firstName,
    // lastName: this.lastName,
    // fullName: this.fullName,
    // avatar: this.avatar,
  };
}

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };