const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
let Users = new Schema({
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
 
module.exports = mongoose.model('Users', Users)