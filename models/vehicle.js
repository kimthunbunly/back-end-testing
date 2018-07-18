const mongoose = require ('mongoose');

const vehicleSchema = new mongoose.Schema ({
	_id : String,
  type   : { type : String , required : true , unique : true , trim : true },
  volume : { type : Number , required : true },
  description : String,
  created     : { type : Date , default : Date.now }
});

module.exports = mongoose.model ('Vehicle' , vehicleSchema );
