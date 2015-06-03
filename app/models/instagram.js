var mongoose = require("mongoose");

exports.Photo = mongoose.model('Photo', {
    title: "string",
    url: "string",
    thumb: "string",
    image: "string"
});
