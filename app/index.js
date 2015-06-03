var express = require('express'),
    querystring = require('querystring'),
    config = require('./config'),
    cookieParser = require('cookie-parser'),
    expressLayouts = require('express-ejs-layouts');
    var bodyParser = require('body-parser');

var app = express();

app.set('port', config.port);
app.set('views', config.view_dir);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/index'); // defaults to 'layout'
app.set("layout extractScripts", true);

app.use(expressLayouts);
app.use(bodyParser.json());
app.use(express.static(config.public_dir));
app.use(require('./routes.js'));

//app.use(require('body-parser'));
app.use(cookieParser(config.cookie.secret));

module.exports = app;
