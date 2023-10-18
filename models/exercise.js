const conn = require('../database/conn');

const Schema = conn.Schema;

const exerciseSchema = new Schema({
    username: { type: String, required: true },
    description: String,
    duration: Number,
    date: { type: Date, default: Date.now }
});

const Exercise = conn.model("Exercise", exerciseSchema);

module.exports = Exercise;