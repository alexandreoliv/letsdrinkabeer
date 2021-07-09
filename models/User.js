const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    githubId: String,
    username: String,
    avatar: String,
    role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user'
    }
});

const User = model("User", userSchema);

module.exports = User;