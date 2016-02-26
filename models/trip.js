// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  vehicle: {
    type: String
  },
  source :{
    type : String
  },
  destination :{
    type : String
  },
  low : {
    type : String
  },
  high : {
    type : String
  },
  status : {
    type : String
  },
   reg_time: {type: Date, default: Date.now}
  },
 {
    versionKey: false // You should be aware of the outcome after set to false
});



// Export the Mongoose model
module.exports = mongoose.model('Trip', UserSchema);