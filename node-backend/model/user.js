const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
 
let User = new Schema({
  userId: {
    type: String, require: true, unique: true 
  },
  userName: {
    type: String
  },
  userPhoneNumber: {
    type: String, require: true, unique: true  
  },
  creator: { type : mongoose.Schema.Types.ObjectId, ref: "User", required: true}
}, {
  collection: 'users'
})

User.plugin(uniqueValidator);
 
module.exports = mongoose.model('User', User)