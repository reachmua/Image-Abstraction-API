// DB Schema

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var searchSchema = new Schema(
    {
        searchVal: String,
        searchDate: Date,
     },
    
     {
         timestamps: true
     }
    
     );
    
// Connect the DB collection
var ModelClass = mongoose.model('searchString', searchSchema);
    
module.exports = ModelClass;