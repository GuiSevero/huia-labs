var mongoose = require("mongoose");

module.exports = mongoose.model('FacebookUpdate', {
    body: "object",
    facebook_signature: "string",
    app_signature: mongoose.Schema.Types.Mixed
});
