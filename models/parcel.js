const mongoose = require ('mongoose');

const parcelSchema = new mongoose.Schema ( {
  qty       : { type : Number , required : true },
  weight    : { type : Number , required : true },
  dimension : {
    length  : { type : Number , required : true },
    width   : { type : Number , required : true },
    height  : { type : Number , required : true },
  },
  volume    : { type : Number , max: 30 },
  price     : { type : Number },
  totalVolume : { type : Number },
  totalWeight : { type : Number },
  description : { type : String },
  created     : { type : Date , default : Date.now }
});

parcelSchema.pre('save' , function (next) {
  const d = this.dimension;
  let volume = d.length * d.width * d.height;
  this.volume = volume / 1000;
  this.totalVolume = volume / 1000 * this.qty;
  this.totalWeight = this.weight * this.qty;
  next();
})
module.exports = mongoose.model ('Parcel' , parcelSchema );
