/*jshint node: true, mocha: true*/

var app, db, request;
function emptyDB() {
    for (var i in db.collections) {
        db.collections[i].remove(function () {});
    }
}

before('Set up app and test environment', function () {
    process.env.NODE_ENV = 'test';
    request = require('supertest');
    app = require('./../app');
    db = app.get('db');
});

after('Close mongo connection', function () {
    db.close();
});

beforeEach('Empty mongo database before each test', function (done) {
    emptyDB();

    return done();
});

afterEach('Empty mongo database after each test', function (done) {
    emptyDB();

    return done();
});