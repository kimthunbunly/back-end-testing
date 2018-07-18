const mongoose = require ('mongoose');

const routeSchema = new mongoose.Schema({
	_id : {type : String},
  from  : { type : String , required : true , trim : true },
  to    : { type : String , required : true , trim : true },
  price : { type : Number },
  distance : { type : Number },
  duration : { type : Number },
  description : { type : String },
  services : [{
    type: String,
    required : true,
    ref: 'Service'
  }],
  trips : [{
    type: String,
    required : true,
    ref: 'Trip'
  }],
  created : { type : Date , default : Date.now }
});

routeSchema.index ({ from : 1, to : 1 }, { unique : true });

routeSchema.pre('findOne' , function () {
  this.
  populate({
    path : 'services',
    populate : {
      path : 'company',
      select : 'name -_id'
    },
    select : 'category -_id'
  }).
  populate('trips', 'departTime eta -_id');
});

module.exports = mongoose.model ('Route' , routeSchema );
