var express = require('express');
var config = require('./config/config.json');
var logger = require('./log');
var bodyParser = require('body-parser');
var domainMiddleware  = require('express-domain-middleware');
var users = require('./routes/users');
var app = express();
var logMiddlewares = require('./middlewares/logging');


app.set('port', process.env.PORT || config.http_port || 3000);
app.set('config', config);
app.set('logger', logger);

// Middlewares
app.use(domainMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logMiddlewares.error);
app.use(logMiddlewares.request);

//Endpoints
app.get('/', function(request, response) {
  response.status(200).json({message: 'Yay!'});
});

app.use('/users', users);

module.exports = app;
