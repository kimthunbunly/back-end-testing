const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const Route = require ('./route');
const calculator = require('../handlers/helpers/calculator');

const tripSchema = new Schema ( {
	_id : String,
  departTime : {
    type : String ,
    validate : {
      validator : function (v) {
        return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message : 'Incorrect format (HH:MM)'
    },
    required : true
  },
  eta : {
    type : String ,
    validate : {
      validator : function (v) {
        return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message : 'Incorrect format (HH:MM)'
    }
  },
  route: {
    type : String ,
    required : true ,
    ref : 'Route'
  },
  services : [{
    type : String ,
    required : true ,
    ref : 'Service'
  }],
  description : String,
  created : { type : Date, default : Date.now }
});

tripSchema.index ( {departTime: 1, route : 1} , {unique : true} );

tripSchema.pre ('findOne' , function () {
  this.populate ({
    path : 'services',
    populate : {
      path : 'company',
      select : 'name -_id'
    },
    select : 'category -_id'
  }).populate('route' , 'from to -_id');
});


tripSchema.pre('save', true , function (next, done) {
  Route.findById( this.route, (err, route) => {
    this.eta.setHours(this.departTime.getHours() + route.duration);
  });
  next();
  setTimeout(done, 100);
});

tripSchema.post ('save' , function (doc) {
  console.log(doc.route);
  Route.updateOne({ _id : doc.route }, {$push : {trips : doc._id }}, (err, route) => {
    console.log(route);
  });
});

tripSchema.post ('remove' , function (doc) {
  Route.updateOne({ _id : doc.route }, {$pull : {trips : doc._id }}, (err, route) => {
    console.log (route);
  });
});

module.exports  = mongoose.model ('Trip' , tripSchema );
