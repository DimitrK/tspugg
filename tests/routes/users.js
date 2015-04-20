/*jshint node: true, mocha: true*/
var app = require('./../../app');
var assert = require('assert');
var request = require('supertest');
var Promise = require('bluebird');
var User = require('./../../models/user');

describe('Requests to users ', function () {
    describe('#GET fb with valid fb access token', function () {
        it('Returns a 200 response code', function (done) {
            var fbToken = 'CAADTbKixqSMBAJhTZCV2kkz845kPztDOkniBpT9zDpklHUel1ZA8DX0EY0hz1I5psnJw6dPnChEtHywwZAQafVR6spOywcWzet7UWuNHP8Vnzesz1TgjbSZBJOzFyZAMx2midO7OPrUMtyKzEMP3cy1fkGYNB1bdq8nkLkmJlmXCfHHzlt38nDkxnCZCjIBnpXQiGZBmUjtSvX5YAO7HY6W';
            request(app)
                .get('/users/fb/' + fbToken)
                .expect(400)
                .expect(/Session has expired/)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

    });

    describe('#GET all users', function () {
        it('Returns a 200 response code', function(done){
            request(app)
                .get('/users')
                .expect(200, done);
        });
        
        it('Returns an empty array when no users exist', function(done){
            request(app)
                .get('/users')
                .expect([], done);
        });

        it('Returns a list with all users', function (done) {
            var userOne = new User({
                name: 'One',
                email: 'One@one.com',
                fb_id: '1'
            });
            var userTwo = new User({
                name: 'Two',
                email: 'Two@one.com',
                fb_id: '2'
            });
            
            Promise.all([userOne.saveAsync(), userTwo.saveAsync()])
                .then(function(){
                   request(app)
                       .get('/users')
                       .expect(function(res){
                            var users = res.body;
                            assert.equal(users.length, 2);
                        })
                       .end(function (err) {
                            if (err) throw err;
                            done();
                        });
                });
        });
    });
    
    describe('#GET a single user', function() {
        it('returns an existing user', function(done){
            var user = new User({
                name: 'One',
                email: 'One@one.com',
                fb_id: '1'
            });
            user.saveAsync()
                .then(function(usr){
                    request(app)
                        .get('/users/' + user.id)
                        .expect(function(res){
                            assert.equal(res.id, usr.id);
                        })
                       .end(function (err) {
                            if (err) throw err;
                            done();
                        });
                });
        });
        
        it('returns empty object for user who doesnt exist', function(done){
            request(app)
                .get('/users/10d0d0d0d0d0d0d0d0d0d0d0')
                .expect({}, done);
        });

    });
});