const mongoose = require('mongoose');

const loginLogsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    time: { type: String, required: true },
});

module.exports = mongoose.model('LoginLogs', loginLogsSchema);