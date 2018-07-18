const queryField = require ('../../config/queryField');
const querySearch = require ('../../config/querySearch');
module.exports = async function (req , res, next) {
  const e   = req.params.entity,
        q   = req.query;
  let limit = 10,
      filter = {},
      opts  = {};

  if (q.limit) limit = parseInt(q.limit);
  if (q !== {} ) {

    await querySearch ( e , q , (result) => {

      filter = result;
    });

  }

  if (q.field) opts = await queryField ( e, q.field , 'option');
  else if (e === 'user') opts.password = false;

  req.limit = limit;
  req.filter = filter;
  req.opts = opts;
  next();
}
