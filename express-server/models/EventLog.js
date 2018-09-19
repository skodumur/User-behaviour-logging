const mongoose = require('mongoose');

const eventLogschema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: { type: String, required: true },
    time: { type: String, required: true },
    owner: { type: String, required: true },
    value: { type: String, required: true },
    question: { type: Number, required: true }
});

module.exports = mongoose.model('EventLogs', eventLogschema);