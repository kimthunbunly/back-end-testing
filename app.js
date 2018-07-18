const express    = require ('express');
const bodyParser = require ('body-parser');
const mongoose   = require ('mongoose');

const api = require ('./handlers/entity') ;
const search = require ('./handlers/search');

const app = express ();
mongoose.connect ('mongodb://localhost:27017/shipping');

let db = mongoose.connection;

db.once ('open', () => console.log ('Connected to MongoDB'));
db.on ('error', (err) => console.log (err) );

app.use ( bodyParser.urlencoded ( { extended : true } ));
app.use ( bodyParser.json () );
app.use (function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});
app.all ('/' , (req, res) => res.json('Welcome to Shipping from ShopRunBack!'));

app.use ('/api' , api );

app.use ('/search' , search );

app.listen (3003 , () => console.log ('listening on port 3003 ...'));
