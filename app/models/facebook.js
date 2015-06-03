var mongoose = require("mongoose");

exports.FacebookUpdate = mongoose.model('FacebookUpdate', {
    body: "object",
    facebook_signature: "string",
    app_signature: mongoose.Schema.Types.Mixed
});
