var subscriptions = 'https://api.instagram.com/v1/subscriptions?client_secret=91106972724240e8896dff48327c3f83&client_id=a50b4ec7d94e456b8f1c7a1d7943844d'

var http = require('http'),
    https = require("https"),
    request = require("request"),
    mongoose = require("mongoose"),
    querystring = require('querystring'),
    _ = require('underscore'),
    Instagram = require('instagram-node-lib'),
    Photo = require('../models/instagram'),
    config = require('../config'),
    io = require('socket.io'),
    pluralize = require('pluralize');

mongoose.connect(process.env.MONGOHQ_URL || config.db.mongo_url);

Instagram.set('client_id', config.instagram.client_id);
Instagram.set('client_secret', config.instagram.client_secret);
Instagram.set('callback_url', config.instagram.callback_url);

exports.get_subscriptions = function(req, res) {

    var url = config.instagram.api.subscriptions + '?client_id=' + config.instagram.client_id + '&client_secret=' + config.instagram.client_secret;

    request.get({
        url: config.instagram.api.subscriptions,
        json: true,
        qs: {
            client_secret: config.instagram.client_secret,
            client_id: config.instagram.client_id
        }
    }, function(error, response, response_body) {

        res.render('instagram/subscriptions', {
            status: {
                code: response.statusCode,
                message: response.statusMessage,
            },
            meta: response_body.meta,
            subscriptions: response.statusCode == 200 ? response_body.data : []
        });

    });
}

exports.get_subscribe = function(req, res) {
    global.io.sockets.emit('test', "test");
    res.send(req.query['hub.challenge']);
};


exports.post_subscribe = function(request, response) {
    // request.body is a JSON already parsed
    request.body.forEach(function(notificationOjb) {
        // Every notification object contains the id of the geography
        // that has been updated, and the photo can be obtained from
        // that geography   

        https.get({
            host: 'api.instagram.com',
            path: '/v1/' + pluralize(notificationOjb.object) + '/' + notificationOjb.object_id + '/media/recent' +
                '?' + querystring.stringify({
                    client_id: config.instagram.client_id,
                    count: 1
                }),
        }, function(res) {

            var raw = "";

            res.on('data', function(chunk) {
                raw += chunk;
            });

            // When the whole body has arrived, it has to be a valid JSON, with data,
            // and the first photo of the date must to have a location attribute.
            // If so, the photo is emitted through the websocket
            res.on('end', function() {

                var response = JSON.parse(raw);
                if (response['data'].length > 0) {

                    for (i in response.data) {

                        var instagram_notif = new Photo({
                            subscription_id: notificationOjb.subscription_id,
                            object: notificationOjb.object,
                            object_id: notificationOjb.object_id,
                            changed_aspect: notificationOjb.changed_aspect,
                            time: notificationOjb.time,
                            url: response.data[i].images.standard_resolution.url,
                            media: response.data[i]
                        });

                        //Previne duplicatas
                        Photo.find({
                            url: response.data[i].images.standard_resolution.url
                        }, function(err, documents) {
                            if (err) res.send(500);
                            if (documents.length == 0) {
                                instagram_notif.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        global.io.sockets.emit('photo', instagram_notif);
                                        console.log(instagram_notif);
                                    }
                                });

                            }
                        });

                    } //endfor
                }
            });

        });
    });
    response.send(200);
};

exports.get_index = function(req, res) {
    Photo.find({}, function(err, documents) {
        if (err) res.send(500);
        res.render('instagram/index', {
            photos: documents
        });
    });
};

exports.get_photos = function(req, res) {
    Photo.find({}, function(err, documents) {
        if (err) res.send(500);
        var output = _.map(documents, function(document) {

            return {
                title: document.title,
                image: document.url,
                src: document.url,
                url: document.url,
                thumb: document.thumb
            }
        });
        res.send(output);
    });
};
