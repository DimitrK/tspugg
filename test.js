var request = require('supertest');
var app = require('./app');

describe('Requests to root ', function() {

    it('Returns a 200 status code', function(done){
        request(app)
        .get('/')
        .expect(200)
        .end(function (err) {
            if (err) throw err;
            done();
        });
    });

    it('Returns JSON ', function(done){
        request(app)
        .get('/')
        .expect('Content-Type', /json/, done);
    });

    it('Returns a JSON with message equal Yay!', function(done){
        request(app)
        .get('/')
        .expect('{"message":"Yay!"}', done);
    });

});

describe('Requests to unknown path', function() {

    it('Returns a 404 status code', function(done){
        request(app)
        .get('/unknown/')
        .expect(404)
        .end(function (err) {
            if (err) throw err;
            done();
        });
    });


});

describe('Requests to user with valid fb access token', function() {

    it('Returns a 200 response code', function(done){
        request(app)
        .get('/users/fb/CAADTbKixqSMBAOxPXDH7ZChUZAC5CARDsgoBhXqhfVUJEKL7sJbDbtRoXlUd1HGugnLpn7FZBHzRgw86ZAFSd6cDCRk7AAVWIjP6YdRJYuopYQjYSg3fskbZADT6L3ICU0ft0hnGkFBJH3vVjBWSnuoKbaZC38Jx9F6U8nbx4DxhljZBI0dzMKRgKvVq0Ais3CzV3ZC8hTJMzixwUtyxXaGM')
        .expect(200)
        .end(function (err) {
            console.log(err);
            if (err) throw err;
            done();
        });
    });


});
