// model for user objects to interact with the database

const mongoose = require("mongoose");

/**     comparison for checking the passwords
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
    // res == true
});
bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
    // res == false
});
*/

// used for encrypting passwords
// var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  email: { type: String, unique: true },
  admin: Boolean,
  wins: Number,
  losses: Number,
  created_at: Date,
  updated_at: Date
});

/*
// runs during user schema to encrypt the password
userSchema.pre('save', function (next) {
    if (this.password) {
        var salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }
    next();
});
*/

var User = mongoose.model("User", userSchema);

module.exports = User;
