const conn = require('../database/conn');

const Schema = conn.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
});

const User = conn.model("User", userSchema);

module.exports = User;