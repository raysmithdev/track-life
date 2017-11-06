'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema ({
  name : {
    firstName: String,
    lastName: String,
    },
  userName: {type: String, required: true},
  password: {type: String, required: true},
  avatar: String,
  trackerIds: [mongoose.Schema.Types.ObjectId]
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
    avatar: this.avatar,
    trackerIds: this.trackerIds
  };
}

const User = mongoose.model('User', userSchema);

module.exports = { User };