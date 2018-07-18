const mongoose = require ('mongoose');
const Schema  = mongoose.Schema;
const Route = require ('./route');
const Trip = require ('./trip');

const asyncForEach = require ('../globle/asyncForEach');

const typeSchema = {
  dropOff       : { type : Boolean , required : true , default : false },
  doorToDoor    : { type : Boolean , required : true , default : false },
  economy       : { type : Boolean , required : true , default : false },
  timedDelivery : { type : Boolean , required : true , default : false }
};

const serviceSchema = new Schema ({
	_id : String,
  company : {
    type : String ,
    required : true ,
    ref : 'Company'
  },
  vehicles : [{
    type : String ,
    required : true ,
    ref : 'Vehicle'
  }],
  type     : typeSchema ,
  category : { type : String , required : true , trim : true },
  price    : { type : Number },
  collectDate    : { type : Date },
  deliveryDate   : { type : Date },
  parcelVolumeMax : { type : Number , default : 30 },
  parcelWeightMax : { type : Number , default : 15 },
  description : String ,
  status : String ,
  trips : [{
    tripId : {
      type : String ,
      required : true ,
      ref : 'Trip'
    },
    totalVolume : { type : Number },
    totalWeight : { type : Number }
  }],
  routes : [{
    type : String ,
    required : true ,
    ref : 'Route'
  }],
  created   : { type : Date , default : Date.now }
});

serviceSchema.index ({ company : 1, category : 1 }, { unique : true });

serviceSchema.pre ('findOne' , function () {
  this.populate('company', 'name -_id');
  this.populate('vehicles', 'type -_id');
  this.populate('routes', 'from to -_id');
  this.populate('trips.tripId', 'eta departTime -_id');
})

serviceSchema.post('save' , function (doc) {
  let routes = [];
  doc.trips.forEach((r) => {
    Trip.findByIdAndUpdate(r.tripId, {$push : {services : doc._id }}, (err, trip) => {
      console.log(routes.includes(trip.route.toString()));
      let t = routes.includes(trip.route.toString());
      if (!t) {
        routes.push(trip.route.toString());
        Route.updateOne({_id : trip.route },{$push : {services : doc._id}}, (err , route) => {
          if (err) throw err;
          console.log({route});
        })
        doc.update({$push : {routes : trip.route }}, (err , updated)=> {
          if (err) console.log(err);
          console.log({service : updated});
        })
      }
    });
  });
})

serviceSchema.post('remove' , function (doc) {
  let routes = [];
  doc.trips.forEach((r) => {
    Trip.findByIdAndUpdate(r.tripId, {$pull : {services : doc._id }}, (err, trip) => {
      if (err) throw err;
      let t = routes.includes(trip.route.toString());
      if (!t) {
        routes.push(trip.route.toString());
        Route.updateOne({_id : trip.route} , {$pull : {services : doc._id}}, (err , route) => {
          console.log (route);
        })
      }
    });
  });
});
module.exports  = mongoose.model ('Service' , serviceSchema );
