var local = require("./default");
var resolve = require('path').resolve;

exports.public_dir = resolve(__dirname, '../../public');
exports.view_dir = resolve(__dirname, '../views');


exports.port = process.env.PORT || local.port;

exports.facebook = {
    client_id: process.env.FB_APP_ID || local.facebook.client_id,
    client_secret: process.env.FB_APP_SECRET || local.facebook.client_secret,
    verify_token: process.env.FB_VERIFY_TOKEN || local.facebook.verify_token
};

exports.instagram = {
    client_id: process.env.INSTA_APP_ID || local.instagram.client_id,
    client_secret: process.env.INSTA_APP_SECRET || local.instagram.client_secret,
    api: {
    	subscriptions: "https://api.instagram.com/v1/subscriptions"
    }
};

exports.db = {
    mongo_url: process.env.MONGOHQ_URL || local.db.mongo_url
};

exports.cookie = {
    secret: process.env.COOKIE_SECRET || local.cookie.secret
}

exports.google = local.google;
