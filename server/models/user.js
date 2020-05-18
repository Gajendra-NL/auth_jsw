const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define user model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// on save hook, encrypt password
// before saving user model, this function runs
userSchema.pre('save', function(next) {
    // get access to user model
    const user = this;

    // generate a salt, then run the call back
    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err); }

        // hash (encrypt) the password using generated salt, then run the call back
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) { return next(err); }

            // over write password with encrypted password and save 
            user.password = hash;
            next();
        })
    })
})

// create the model class
const ModelClass = mongoose.model('user', userSchema);

// export the model
module.exports  = ModelClass;
