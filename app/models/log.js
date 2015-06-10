var mongoose = require("mongoose");

module.exports = mongoose.model('Log', {
    date: Date,
    data: mongoose.Schema.Types.Mixed
});
