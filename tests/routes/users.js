/*jshint node: true, mocha: true*/
var app = require('./../../app');
var request = require('supertest');
describe('Requests to users', function () {
    describe('#get() fb with valid fb access token', function () {
        it('Returns a 200 response code', function (done) {
            var fbToken = 'CAADTbKixqSMBAOxPXDH7ZChUZAC5CARDsgoBhXqhfVUJEKL7sJbDbtRoXlUd1HGugnLpn7FZBHzRgw86ZAFSd6cDCRk7AAVWIjP6YdRJYuopYQjYSg3fskbZADT6L3ICU0ft0hnGkFBJH3vVjBWSnuoKbaZC38Jx9F6U8nbx4DxhljZBI0dzMKRgKvVq0Ais3CzV3ZC8hTJMzixwUtyxXaGM';
            request(app)
                .get('/users/fb/' + fbToken)
                .expect(200)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

    });
});