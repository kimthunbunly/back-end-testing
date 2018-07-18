const entity = require ('../helpers/modelObject');
const asyncForEach = require('../../globle/asyncForEach');

module.exports.insert = {
  user : function (req , res , next) {
    require ('../helpers/saltPassword') ( req.body.password , (hash) => {
      req.body.password = hash;
      next();
    });
  },
  service: function (req , res , next) {
    entity['vehicle'].find ({_id: {$in: req.body.vehicles}}, (err, vehicles) => {
      let total = 0;
      vehicles.forEach((v) => {
        total += v.volume;
      });
      if (req.body.trips.length > 0) {
        req.body.trips.forEach ((r) => {
          r.totalVolume = total * 30;
          r.totalWeight = total * 10;
        });
      }
      next();
    });
  },
  shipment: function (req , res , next) {
    const b = req.body;
    entity ['trip'].findById (b.trip , (err, trip) => {
      if (err) console.log(err);
      if (trip) {
        preShipment(req.body , next);
      } else {
        res.json ('Not existed trip');
      }
    });
  },
  trip : function (req , res , next) {
    entity ['route'].findById(req.body.route, (err, route) => {
      if(err) console.log (err);
      if(route) next();
      else res.json('Not existed route');
    })
  }
}

module.exports.remove = {
  trip : function (req , res , next) {
    entity ['service'].updateMany ({}, {$pull : {trips: {tripId: req.params.id} }}, (err, updated) => {
      if(err) console.log(err);
      console.log({service : updated});
      next();
    })
  },
  route : function (req , res , next) {
    entity['trip'].find ({route : req.params.id}, (err, trips) => {
      if(err) console.log(err);
      trips.forEach(trip => {
        trip.remove((err, result) => {
          if (err) console.log(err);
          entity ['service'].updateMany({},{$pull : {trips : {tripId : result._id}}}, (err, update) => {
            if(err) console.log(err);
            console.log({serviceTrip : update});
          })
          console.log({removeTrip:result});
        })
      })
    })
    entity ['service'].updateMany ({}, {$pull : { routes : req.params.id }}, (err, result) => {
      if (err) console.log(err);
      console.log({service : result });
    })
    next();
  }
}

const start = async (parcels) => {
  let parcelIds = [];
  let totalVolume = 0;
  let totalWeight = 0;
  await asyncForEach (parcels, async (parcel) => {
    const promise = entity ['parcel'].create (parcel);
    await promise.then((parcel) => {
      parcelIds.push (parcel._id);
      totalVolume += parcel.totalVolume;
      totalWeight += parcel.totalWeight;
    })
    .catch (console.error);
  })
  return { parcelIds, totalVolume, totalWeight };
}

function preShipment (body , next) {
  start (body.parcels)
  .then((obj) => {
    console.log(obj);
    updateService (body, obj.totalVolume, obj.totalWeight);
    body.parcels = obj.parcelIds;
    next();
  })
  .catch(console.error);
}

function updateService (body ,totalVolume, totalWeight) {
  const filter1 = { _id : body.chosenService  };
  const option = { "trips" : {$elemMatch : { tripId : body.trip }}};

  entity ['service'].findOne (filter1, option, (err, service) => {
    if (err) throw err;
    if (service) {
      const tripLength = service.trips.length;
      if (tripLength === 1) {
        let volume = service.trips[0].get('totalVolume'),
            weight = service.trips[0].get('totalWeight');
        if ( volume >= totalVolume && weight >= totalWeight) {
          const filter2 = {
            _id : body.chosenService,
            "trips.tripId" : body.trip
          }
          const update = {
            $inc : { "trips.$.totalVolume" : -totalVolume , "trips.$.totalWeight" : -totalWeight }
          }
          entity ['service'].updateOne (filter2 , update , (err , updated) => {
            console.log({updated});
          })
        }
        else {
          console.log('Oop! there is no enough space!');
        }
      }
      else {
        console.log ('Sorry, the chosen service doesn\'t serve for the trip!');
      }
    }
    else {
      console.log('Not existed Service');
    }
  })
}
