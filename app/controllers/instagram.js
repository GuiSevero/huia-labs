
var subscriptions = 'https://api.instagram.com/v1/subscriptions?client_secret=91106972724240e8896dff48327c3f83&client_id=a50b4ec7d94e456b8f1c7a1d7943844d'

var http = require('http'),
    https = require("https"),
    mongoose = require("mongoose"),
    querystring = require('querystring'),
    _ = require('underscore'),
    Instagram = require('instagram-node-lib'),
    Photo = require('../models/instagram'),
    config = require('../config');

mongoose.connect(process.env.MONGOHQ_URL || config.db.mongo_url);

Instagram.set('client_id', config.instagram.client_id);
Instagram.set('client_secret', config.instagram.client_secret);
Instagram.set('callback_url', config.instagram.callback_url);


exports.get_subscribe =  function(req, res) {
    res.send(req.query['hub.challenge']);
    io.sockets.emit('test', req.query['hub.challenge']);
};


exports.post_subscribe = function(request, response) {
    // request.body is a JSON already parsed
    request.body.forEach(function(notificationOjb) {
        // Every notification object contains the id of the geography
        // that has been updated, and the photo can be obtained from
        // that geography   

        https.get({
            host: 'api.instagram.com',
            path: '/v1/tags/' + notificationOjb.object_id + '/media/recent' +
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

                        var idata = {
                            title: response.data[i].caption.text,
                            url: response.data[i].images.standard_resolution.url,
                            image: response.data[i].images.standard_resolution.url,
                            thumb: response.data[i].images.thumbnail.url
                        }
                        var photo = new Photo(idata);

                        //Previne duplicatas
                        Photo.find({
                            url: idata.url
                        }, function(err, documents) {
                            if (err) res.send(500);
                            if (documents.length == 0) {
                                photo.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        io.sockets.emit('photo', idata);
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

exports.get_index =  function(req, res) {
    Photo.find({}, function(err, documents) {
        if (err) res.send(500);
        res.render('index', {
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