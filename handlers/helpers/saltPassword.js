const bcrypt = require ('bcryptjs');

module.exports = function (password , done) {
  bcrypt.genSalt ( 10, function (err, salt) {
    bcrypt.hash ( password, salt, (err, hash) => {
      if (err) throw err;
      done (hash);
    });
  });
}

const comparePassword = (candidatePassword, hash , callback ) => {
  bcrypt.compare (candidatePassword, hash, callback );
};
