var express = require('express')
var router = express.Router()
var controllers = require('./controllers')
var passport = require('passport')
var huia_auth = require('./services/huia_auth')
var LocalStrategy = require('passport-local').Strategy


passport.use(new LocalStrategy(
    function(username, password, done) {
        var user = huia_auth.auth(username, password, function(err, user) {
            return done(null, user)
        })
    }
))

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

router.get('/login', controllers.login.get_login)
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/'
    }),
    function(req, res) {
        res.redirect('/')
    })


//Home
router.get('/', authorize, controllers.instagram.get_index)

//Facebook
router.get('/facebook/challenge', controllers.facebook.get_challenge)
router.post('/facebook/callback', controllers.facebook.post_callback)

//Instagram
router.get('/instagram/', controllers.instagram.get_index)
router.get('/instagram/subscribe', controllers.instagram.get_subscribe)
router.post('/instagram/subscribe', controllers.instagram.post_subscribe)
router.get('/instagram/photos', controllers.instagram.get_photos)

module.exports = router


function authorize(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}