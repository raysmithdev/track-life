'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema ({
  firstName: String,
  lastName: String,
  userName: {type: String, required: true},
  password: {type: String, required: true},
  avatar: String,
  trackerIds: [mongoose.Schema.Types.ObjectId]
});


userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

//what is the purpose of this method?
userSchema.methods.toClient = function () {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    userName: this.userName,
    avatar: this.avatar,
    trackerIds: this.trackerIds
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