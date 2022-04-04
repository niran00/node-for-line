const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
 
let User = new Schema({
  userId: {
    type: String
  },
  userName: {
    type: String
  },
  userPhoneNumber: {
    type: String
  }
}, {
  collection: 'users'
})

User.plugin(uniqueValidator);
 
module.exports = mongoose.model('User', User)