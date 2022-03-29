const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
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
 
module.exports = mongoose.model('User', User)