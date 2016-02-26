// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var CSchema = new mongoose.Schema({
  vehicle: {
    type: String
  },
  data : [],
  status : {
    type : String
  },
   reg_time: {type: Date, default: Date.now}
  },
 {
    versionKey: false // You should be aware of the outcome after set to false
});



// Export the Mongoose model
module.exports = mongoose.model('Notify', CSchema);