/*jshint node: true, mocha: true*/
var app = require('./../../app');
var request = require('supertest');
describe('Requests to root with method ', function () {
    describe('#get()', function () {
        it('Returns a 200 status code', function (done) {
            request(app)
                .get('/')
                .expect(200, done);
        });

        it('Returns JSON ', function (done) {
            request(app)
                .get('/')
                .expect('Content-Type', /json/, done);
        });

        it('Returns a JSON with message equal Yay!', function (done) {
            request(app)
                .get('/')
                .expect(/Yay!/, done);
        });

    });
});

describe('Requests to unknown path', function () {

    it('Returns a 404 status code', function (done) {
        request(app)
            .get('/unknown/')
            .expect(404)
            .end(function (err) {
                if (err) throw err;
                done();
            });
    });


});