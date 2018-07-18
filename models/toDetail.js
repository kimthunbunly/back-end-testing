const mongoose = require('mongoose');
require('mongoose-type-email');

const toSchema = new mongoose.Schema({
  firstName : { type : String , required : true , trim : true },
  lastName  : { type : String , required : true , trim : true },
  company  : String ,
  email    : {
    type : mongoose.SchemaTypes.Email ,
    required : true
  },
  phone    : {
    type : String ,
    required : [ true, 'Company phone number required' ] ,
    unique : true ,
    default: undefined ,
    trim : true ,
    minlength : 9 ,
    maxlength : 13 ,
    validate : {
      validator : function(v) {
        return /\d{9}/.test(v);
      },
      message : '{VALUE} is not a valid phone number!'
    }
  },
  address  : {
    type : String ,
    required : true
  },
  town     : String ,
  postcode : String
})

module.exports = mongoose.model ('toDetail', toSchema);
