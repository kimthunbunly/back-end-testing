const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const Parcel   = require ('./parcel');
const Service  = require ('./service');

const asyncForEach = require('../globle/asyncForEach');

const shipmentSchema = new Schema ( {
  trip    : { type : Schema.Types.ObjectId , required : true , ref: 'Trip' },
  nParcel  : { type : Number , required : true },
  parcels  : [{
    type : Schema.Types.ObjectId ,
    ref : 'Parcel',
    required : true
  }],
  status : { type : String , trim : true } ,
  chosenService : { type : Schema.Types.ObjectId , ref : 'Service' },
  parcelDetail  : {
    reason  : { type : String , trim : true },
    content : { type : String , trim : true }
  },
  fromDetail : { type : Schema.Types.ObjectId , ref : 'fromDetail' },
  toDetail   : { type : Schema.Types.ObjectId , ref : 'toDetail' },
  description : { type : String },
  created : { type : Date , default : Date.now }
});

shipmentSchema.pre ('findOne' , function () {
  this.populate ('parcels', 'dimension weight qty');
  this.populate ('trip' , 'eta departTime -_id');
  this.populate ('fromDetail');
  this.populate ('toDetail');
  this.populate ('chosenService');
});

const start = async (parcels) => {
  let totalVolume = 0;
  let totalWeight = 0;
  await asyncForEach (parcels, async (parcel) => {
    const promise = Parcel.findByIdAndDelete (parcel).exec();
    await promise.then((parcel) => {
      totalVolume += parcel.totalVolume;
      totalWeight += parcel.totalWeight;
    })
    .catch (console.error);
  })
  return { totalVolume, totalWeight };
}

shipmentSchema.post('remove' , function (doc) {
  start (doc.parcels)
  .then (obj => {
    const filter = {
      _id : doc.chosenService,
      "trips.tripId" : doc.trip
    }
    const update = {
      $inc : {
        "trips.$.totalVolume" : obj.totalVolume ,
        "trips.$.totalWeight" : obj.totalWeight
      }
    }
    console.log( {filter , update} );
    Service.findOneAndUpdate (filter, update, (err, service) => {
      if (err) throw err;
      console.log({service });
    })
  })
});

module.exports = mongoose.model ('Shipment' , shipmentSchema );
