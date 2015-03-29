/*jshint node: true, mocha: true*/
var assert = require('assert');
var config = require('./../../config/config');
var defaults = require('./../../config/defaults.json');

describe('Settings module property', function () {
    var originalNodeEnv;

    beforeEach(function () {
        originalNodeEnv = process.env.NODE_ENV;
        delete process.env.OPENSHIFT_LOG_DIR;
        delete process.env.OPENSHIFT_NODEJS_PORT;
        delete process.env.PORT;
        delete process.env.MONGO_DB_URL;
        delete process.env.MONGO_DB_HOST;
        delete process.env.MONGO_DB_PORT;
        delete process.env.MONGO_DB_NAME;
        delete process.env.MONGO_DB_USERNAME;
        delete process.env.MONGO_DB_PASSWORD;
        delete process.env.OPENSHIFT_MONGO_DB_URL;
        delete process.env.OPENSHIFT_MONGO_DB_HOST;
        delete process.env.OPENSHIFT_MONGO_DB_PORT;
        delete process.env.OPENSHIFT_MONGO_DB_NAME;
        delete process.env.OPENSHIFT_MONGO_DB_USERNAME;
        delete process.env.OPENSHIFT_MONGO_DB_PASSWORD;
        delete process.env.MONGOLAB_URI;
        delete process.env.MONGOHQ_URL;
        delete require.cache[require.resolve('./../../config/config')];
    });

    afterEach(function () {
        config = undefined;
        process.env.NODE_ENV = originalNodeEnv;
    });
    
    describe('#environment', function () {


        it('For NODE_ENV:production should set environment variable equals with "production"', function () {
            process.env.NODE_ENV = 'production';
            config = require('./../../config/config');
            assert.equal(config.environment, 'production');
        });

        it('For NODE_ENV:development should set environment variable equals with "development"', function () {
            process.env.NODE_ENV = 'development';
            config = require('./../../config/config');
            assert.equal(config.environment, 'development');
        });

        it('For NODE_ENV:test should set environment variable equals with "test"', function () {
            process.env.NODE_ENV = 'test';
            config = require('./../../config/config');
            assert.equal(config.environment, 'test');
        });

        it('For NODE_ENV:unknown should set environment variable equals with default "development"', function () {
            process.env.NODE_ENV = 'development';
            config = require('./../../config/config');
            assert.equal(config.environment, defaults.environment);
        });

        it('For NODE_ENV:undefined should set environment variable equals with default "development"', function () {
            process.env.NODE_ENV = undefined;
            config = require('./../../config/config');
            assert.equal(config.environment, defaults.environment);
        });

        it('For NODE_ENV:null should set environment variable equals with default "development"', function () {
            process.env.NODE_ENV = undefined;
            config = require('./../../config/config');
            assert.equal(config.environment, defaults.environment);
        });
    });
    
    describe('#db', function() {
        
        describe('#uri', function() {
            it('should be equals to constructed uri for NODE_ENV:test with db password not set', function(){
                process.env.NODE_ENV = 'test';
                config = require('./../../config/config');
                var dbDefaultSettings = defaults[config.environment];
                var constructedUri = 'mongodb://' + dbDefaultSettings.username + '@' + dbDefaultSettings.host + ':' + dbDefaultSettings.port + '/' + dbDefaultSettings.database;
                assert.equal(config.db.uri, constructedUri);
                
            });            
            
            it('should be equals to constructed uri for NODE_ENV:development with db password not set', function(){
                process.env.NODE_ENV = 'development';
                config = require('./../../config/config');
                var dbDefaultSettings = defaults[config.environment];
                var constructedUri = 'mongodb://' + dbDefaultSettings.username + '@' + dbDefaultSettings.host + ':' + dbDefaultSettings.port + '/' + dbDefaultSettings.database;
                assert.equal(config.db.uri, constructedUri);
                
            });
            
            it('should be equals to constructed uri for NODE_ENV:production and db password set', function(){
                process.env.NODE_ENV = 'production';
                config = require('./../../config/config');
                var dbDefaultSettings = defaults[config.environment];
                var constructedUri = 'mongodb://' + dbDefaultSettings.username + ':' + dbDefaultSettings.password + '@' + dbDefaultSettings.host + ':' + dbDefaultSettings.port + '/' + dbDefaultSettings.database;
                assert.equal(config.db.uri, constructedUri);
                
            });
            
            it('should be equals to given uri as enviroment variable MONGO_DB_URL once it is set', function(){
                process.env.MONGO_DB_URL = 'mongo://root@localhost:57024/test';
                config = require('./../../config/config');
                assert.equal(config.db.uri, process.env.MONGO_DB_URL);
                
            });
        });

    });
});