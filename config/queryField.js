const entity = require ('./object');

module.exports = async function (ent, p , param) {

  if ( !entity [ent] ) return console.log ('No entity');
  else {
    const keys = Object.keys(entity [ent] );
    const object = {};
    switch (param) {
      case 'update':

        for ( key of keys) {
          if ( p [key] ) object [key] = p [key];
        }
        return object;
        break;
        case 'option':
          for ( key of keys) {
            if ( p [key] ) object [key] = true;
          }

          return object;
          break;
      default: console.log ('Hello from switch');
    }
  }
}
