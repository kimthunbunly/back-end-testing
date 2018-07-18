const object = {
  company  : {
    _id : 'ObjectId',
    name : 'String',
    address : 'String',
    contact : 'String',
    logo : 'String',
    rate : 'Number',
    website : 'String',
    description : 'String'
  },
  vehicle  : {
    _id : 'ObjectId',
    type : 'String',
    volume : 'Number',
    description : 'String',
  },
  parcel   : {
    _id : 'ObjectId',
    qty : 'Number',
    dimension : {
      length : true,
      width : true,
      height : true,
    },
    price : 'Number',
    description : 'String'
  },
  route    : {
    _id : 'ObjectId',
    from : 'String',
    to : 'String',
    price : 'Number',
    description : 'String',
    services : 'ArrayId',
    trips : 'ArrayId'
  },
  service  : {
    _id : 'ObjectId',
    vehicles : 'ArrayId',
    company : 'ObjectId',
    type : 'Object',
    category : 'String',
    price : 'Number',
    collectDate : true,
    deliveryDate : true,
    routes : 'ArrayId',
    status : 'String',
    description : 'String'
  },
  trip : {
    _id : 'ObjectId',
    route : 'ObjectId',
    departTime : 'String',
    eta : 'String',
    services : 'ArrayId'
  },
  from  : {
    _id : 'ObjectId',
    firstName : 'String',
    lastName : 'String',
    company : 'String',
    email : 'String',
    phone : 'String',
    address : 'String',
    town : 'String',
    postcode : 'String',
    description : 'String'
  },
  to  : {
    _id : 'ObjectId',
    firstName : 'String',
    lastName : 'String',
    company : 'String',
    email : 'String',
    phone : 'String',
    address : 'String',
    town : 'String',
    postcode : 'String',
    description : 'String'
  },
  shipment : {
    _id : 'ObjectId',
    trip : 'ObjectId',
    parcels : 'ArrayId',
    chosenService : 'ObjectId',
    parcelDetail : true,
    fromDetail : 'ObjectId',
    toDetail : 'ObjectId',
    //payment : true,
    status : 'String',
    description : 'String'
  },
  user     : {
    _id : 'ObjectId',
    firstName : 'String',
    lastName : 'String',
    email : 'String',
    phone : 'String',
    address : 'String',
    shipments : 'ArrayId'
  }
}

module.exports = object;
