var defaults = require('./defaults.json');
var config = {};
/**
 * Retrieves the correct environment the server should run. Highest priority
 * has the environmental variable NODE_ENV if any, and follows the config file.
 * Also if the environment is not set correctly to either `development`, `production` 
 * or `test`, returns `development` as default environment
 * 
 * @return {String}  The environment as string
 */ 
function getEnvironment(){
    var statedEnvironment = process.env.NODE_ENV || defaults.environment;
    // The first environment in availableEnvironments is the default one.
    var availableEnvironments = ['development', 'production', 'test'];
    var environment;
    
    availableEnvironments.forEach(function(env){
        if( ~statedEnvironment.indexOf(env) ){
            environment = env;
        }
    });
    if( environment ) {
        return environment;
    } else {
        return availableEnvironments[0];
    }
}


config.environment = getEnvironment();

config.fb_token = defaults.fb_token;

config.log_folder = process.env.OPENSHIFT_LOG_DIR || defaults.log_folder;

config.http_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || defaults.http_port;

if( !config.log_folder || !config.http_port || !config.environment || !config.fb_token ) {
    throw "Some generic settings could not be resolved. Please check configurations.";
}


var defaultDbSettings = defaults[config.environment];
var dbDialect = defaultDbSettings.dialect.toUpperCase();

config.db = {};

config.db.host =  process.env['OPENSHIFT_'+ dbDialect +'_DB_HOST'] || process.env[ dbDialect + '_DB_HOST'] || defaultDbSettings.host;

config.db.username = process.env['OPENSHIFT_'+ dbDialect +'_DB_USERNAME'] || process.env[dbDialect +'_DB_USERNAME'] || defaultDbSettings.username;

config.db.password = process.env['OPENSHIFT_'+ dbDialect +'_DB_PASSWORD'] || process.env[dbDialect +'_DB_PASSWORD'] || defaultDbSettings.password;

config.db.port = process.env['OPENSHIFT_'+ dbDialect +'_DB_PORT'] || process.env[dbDialect +'_DB_PORT'] || defaultDbSettings.port;

config.db.name = process.env['OPENSHIFT_'+ dbDialect +'_DB_NAME'] || process.env[dbDialect +'_DB_NAME'] || defaultDbSettings.database;

config.db.uri = (function getMongoUri(){
    
    var herokuMongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
    var openshiftMongoUri = process.env['OPENSHIFT_'+ dbDialect +'_DB_URL'];
    var envMongoUri =  process.env[dbDialect +'_DB_URL'];
    
    var dialect = dbDialect.toLowerCase().indexOf('mongo') > -1 ? 'mongodb' : dbDialect.toLowerCase();
    
    var dbPasswwordUriPart = config.db.password ? ':' + config.db.password : '';
    
    var constructedUri = dialect + '://' + config.db.username + dbPasswwordUriPart + '@' + config.db.host + ':' + config.db.port + '/' + config.db.name;
    
    
    return herokuMongoUri || openshiftMongoUri || envMongoUri || constructedUri;
})();

if( !config.db.host || !config.db.username || !config.db.port || !config.db.name ) {
    throw "Some settings related to DB could not be resolved. Please check configurations.";
}


module.exports = config;
