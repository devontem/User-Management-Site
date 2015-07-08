//require all the packages needed for app
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//Declaring user schema
var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false }
});


//Hash the password before saving
UserSchema.pre('save', function(next){
    
    var user = this;
    
    //MIDDLEWARE: only hashes password if it's new or been modified
    if (!user.isModified('password')){ 
        return next();
    }
    
    //MIDDLEWARE: hashing the password and reassigning
    bcrypt.hash(user.password, null, null, function(err, hash){
        if (err) return next(err);
        
        //change the passwprd to the hashed version
        user.password = hash;
        next();
    });
    
});

//Method to compare given password with database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

//RETURNING the model
module.exports = mongoose.model('User', UserSchema);