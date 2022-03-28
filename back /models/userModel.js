const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	email: {
		type: String,
		unique: true,
        required: true,
	},
	password: {
    type: String,
    required: true,
    max: 8
    
    },
    confirmPassword: {
        type: String,
        required: true,
        max: 8
        },
    firstName: String,
    surName: String,
    dateOfBirth: Date

});

const User = mongoose.model("User", UserSchema);

module.exports = User;