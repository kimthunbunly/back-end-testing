const object = require ('./object');
const ObjectID = require ('mongodb').ObjectID;

async function arrangeQuery (entity, q , callback) {
  let query = {};
  const keys = Object.keys( object [entity] );
  const ent = object [entity];

  for ( key of keys) {
    switch (ent [key]) {
      case 'String':
        if ( q [key]) query[key] = {$regex: q [key], $options:'i' }
        break;
        case 'Number':
        if ( q [key]) query[key] = {$eq : parseInt(q [key])}
          break;
          case 'ObjectId':
          if ( q [key] && ObjectID.isValid(q[key])) query[key] = {$in : q [key] };
            break;
            case 'ArrayId':
              if ( q [key] && ObjectID.isValid(q[key])) query[key] = {$in : q [key] };
              break;
      default: continue;
    }
  }
  callback(query);

}

module.exports = arrangeQuery;
