var express = require('express')
var router = express.Router()
var controllers = require('./controllers')

//Home
router.get('/', controllers.instagram.get_index)

//Facebook
router.get('/facebook/challenge', controllers.facebook.get_challenge)
router.post('/facebook/callback', controllers.facebook.post_callback)

//Instagram
router.get('/instagram/', controllers.instagram.get_index)
router.get('/instagram/subscribe', controllers.instagram.get_subscribe)
router.post('/instagram/subscribe', controllers.instagram.post_subscribe)
router.get('/instagram/photos', controllers.instagram.get_photos)

module.exports = router
