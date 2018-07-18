const mongoose = require ('mongoose');
require('mongoose-type-email');
const Schema = mongoose.Schema;

const userSchema = new Schema ( {
  email     : { type : mongoose.SchemaTypes.Email , required : true , trim : true },
  password  : { type : String , required : true },
  firstName : { type : String , required : true , trim : true },
  lastName  : { type : String , required : true , trim : true },
  address   : { type : String , required : true },
  phone     : {
    type : String ,
    required : [ true , 'Company phone number required' ],
    unique : true ,
    default: undefined ,
    trim : true ,
    minlength : 9 ,
    maxlength : 13 ,
    validate : {
      validator : function (v) {
        return /\d{9}/.test(v);
      },
    message : '{VALUE} is not a valid phone number!'
  }},
  shipments : [ { type: Schema.Types.ObjectId , ref: 'Shipment' } ],
  created   : { type : Date , default : Date.now }
});

module.exports = mongoose.model ( 'User' , userSchema );
