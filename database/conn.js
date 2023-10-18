require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
    });

module.exports = mongoose;