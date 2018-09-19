const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    pass: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);