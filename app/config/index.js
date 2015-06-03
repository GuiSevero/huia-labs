var local = require("./development");
var resolve = require('path').resolve;

exports.public_dir = resolve(__dirname, '../../public');
exports.view_dir = resolve(__dirname, '../views');


exports.port = process.env.PORT || local.port;

exports.facebook = {
    app_id: process.env.FB_APP_ID || local.facebook.app_id,
    app_secret: process.env.FB_APP_SECRET || local.facebook.app_secret,
    verify_token: process.env.FB_VERIFY_TOKEN || local.facebook.verify_token
};

exports.instagram = {
    app_id: process.env.INSTA_APP_ID || local.instagram.app_id,
    app_secret: process.env.INSTA_APP_SECRET || local.instagram.app_secret
};

exports.db = {
    mongo_url: process.env.MONGOHQ_URL || local.db.mongo_url
};

exports.cookie = {
    secret: process.env.COOKIE_SECRET || local.cookie.secret
}
