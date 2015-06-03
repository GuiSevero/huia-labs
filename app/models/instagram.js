var mongoose = require("mongoose");

module.exports = mongoose.model('Photo', {
    title: "string",
    url: "string",
    thumb: "string",
    image: "string"
});
