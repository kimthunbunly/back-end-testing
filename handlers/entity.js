const router = require ('express').Router();

const entity = require ('./helpers/modelObject');
const queryField = require ('../config/queryField');
const checkUrl = require ('./middlewares/checkUrl');
const insert = require ('./middlewares/entity').insert;
const remove = require ('./middlewares/entity').remove;

router.param ('entity' , (req, res, next) => {
  if ( entity [req.params.entity] ) next();
  else {
    res.json ( { checkEntity : req.params.entity + ' is not existed!' });
  }
});

router.post ('/user' , insert['user']);
router.post ('/service' , insert['service']);
router.post ('/shipment' , insert['shipment']);
router.post ('/trip' , insert['trip']);

router.delete ('/trip/:id' , remove['trip']);
router.delete ('/route/:id' , remove['route']);

router.all ('/' , (req , res) => {
  res.json ('Welcome to api route!');
});

router.route ('/:entity')
  .get(checkUrl, (req, res) => {
    const e   = req.params.entity,
          q   = req.query;

    entity [e].find ( req.filter, req.opts , (err, result) => {
      if (err) throw err;
      res.json (result);
  }).sort(q.sort).limit( req.limit );
})
  .post( (req, res) => {
    entity [req.params.entity].create ( req.body, (err, result) => {
      if (err) throw err;
      res.json (result);
    })
  });

router.route ('/:entity/:_id')
  .get ( (req, res) => {
    entity [req.params.entity].findById (req.params._id, (err, result) => {
      if (err) throw err;
      res.json (result);
    })
  })
  .put ( (req, res) => {
    const e = req.params.entity;
    const update = queryField ( e , req.body , 'update');
    entity [e].findByIdAndUpdate ( req.params._id, update , (err, result) => {
      if (err) throw err;
      res.json (result);
    })
  })
  .delete ( (req, res) => {
    entity [req.params.entity].find ( { _id : req.params._id }, (err, doc) => {
      if (err) throw err;
      if (!doc[0]) {
        res.json(doc);
      }
      else {
        doc[0].remove ((err, result) => {
          if (err) throw err;
          res.json ({DELETED : result});
        });
      }
    })
  });

module.exports = router;
