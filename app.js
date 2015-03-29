var config = require('./config/config');
var logger = require('./log');

var WebSocketServer = require('ws').Server;

/* Express app and routes*/
var express = require('express');
var app = express();
var users = require('./routes/users');

/* Express middlewares */
var bodyParser = require('body-parser');
var domainMiddleware  = require('express-domain-middleware');
var logMiddlewares = require('./middlewares/logging');


var mongoose = require("./utils/mongoose-bluebird");
mongoose.connect(config.db.uri);
mongoose.connection.on('error', logger.error.bind(logger, 'connection error:'));
mongoose.connection.once('open', logger.info.bind(logger, 'Succesfully connected to db.'));

app.set('db', mongoose.connection);
app.set('config', config);
app.set('logger', logger);
app.set('wss', WebSocketServer);

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
