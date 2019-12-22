var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

// Gives access to methods
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);