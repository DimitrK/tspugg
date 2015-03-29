var winston = require('winston');
var path = require('path');
var config = require('./config/config');
var environment = config.environment;
var fileLoglevel = ~environment.indexOf('test') ? 'never' : ~environment.indexOf('development') ? 'debug' : 'info';
var consoleLogLevel = ~environment.indexOf('test') ? 'never' : 'info';
var logger;

winston.setLevels({
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    never: 10
});
winston.addColors({
    debug: 'green',
    info: 'cyan',
    warn: 'yellow',
    error: 'red'
});

if( winston.transports.length !== 2 ) {

    logger = new(winston.Logger)({
        transports: [
            new(winston.transports.Console)({
                level: consoleLogLevel,
                handleExceptions: true,
                prettyPrint: true,
                silent: false,
                timestamp: true,
                colorize: true
            }),
          new(winston.transports.DailyRotateFile)({
                level: fileLoglevel,
                name: 'log#debug',
                handleExceptions: true,
                filename: path.join(__dirname, config.log_folder, "log_file.log")
            })
        ]
    });
}


module.exports = logger || winston;