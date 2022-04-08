const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
 
let User = new Schema({
  userId: {
    type: String, require: true, unique: true 
  },
  userEmail: {
    type: String, require: true, unique: true 
  },
  userName: {
    type: String, require: true
  },
  userPhoneNumber: {
    type: String, require: true, unique: true  
  }
}, {
  collection: 'users'
})

User.plugin(uniqueValidator);
 
// "relaunch"
module.exports = mongoose.model('User', User)
