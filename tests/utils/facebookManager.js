/*jshint node: true, mocha: true*/
var fbToken = 'CAADTbKixqSMBAOxPXDH7ZChUZAC5CARDsgoBhXqhfVUJEKL7sJbDbtRoXlUd1HGugnLpn7FZBHzRgw86ZAFSd6cDCRk7AAVWIjP6YdRJYuopYQjYSg3fskbZADT6L3ICU0ft0hnGkFBJH3vVjBWSnuoKbaZC38Jx9F6U8nbx4DxhljZBI0dzMKRgKvVq0Ais3CzV3ZC8hTJMzixwUtyxXaGM';
var assert = require('assert');
var facebookManager = require('./../../utils/facebookManager');

describe('Facebook manager (user token expired)', function () {

    describe('#buildUserPhotoUrl()', function () {

        it('Should return a correct fb photo url', function () {
            var fbId = 1234;
            var expected = 'http://graph.facebook.com/1234/picture?type=large';
            assert.equal(facebookManager.buildUserPhotoUrl(fbId), expected);
        });


    });

    describe('#verifyToken()', function () {

        it('Should be able to contact fb graph API with status code 200', function (done) {
            facebookManager.verifyToken(fbToken)
                .then(function (response) {
                    assert.equal(response.statusCode, 200);
                    done();
                })
                .catch(function (err) {
                    throw err;
                });
        });
    });

    describe('#getUser()', function () {

        it('Should be able to contact fb graph API with status code 400', function (done) {
            facebookManager.getUser(fbToken)
                .then(function (response) {
                    assert.equal(response.statusCode, 400);
                    done();
                })
                .catch(function (err) {
                    throw err;
                });
        });
        
        it('Should be able to contact fb graph API with error being set ', function (done) {
            facebookManager.getUser(fbToken)
                .then(function (response) {
                    var body = JSON.parse(response.body);
                    assert.equal(!!body.error, true);
                    done();
                })
                .catch(function (err) {
                    throw err;
                });
        });
    });
});