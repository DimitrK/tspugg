var express = require('express');
var User = require('./../models/user');
var fbManager = require('./../utils/facebookManager');
var router = express.Router();


router.get('/fb/:fb_token', function (request, response) {
    var logger = request.app.get('logger');
    var fbUser;
    logger.info('Verifying token');
    fbManager.verifyToken(request.params.fb_token)
        .then(function (fbVerifyResponse) {
            var body = JSON.parse(fbVerifyResponse.body);
            var data = body.data;
            if (!body.error && data && data.is_valid) {
                logger.info('User with FB id ' + data.user_id + ' stated as valid from graph API. Retrieving user info...');
                return fbManager.getUser(request.params.fb_token);
            } else {
                logger.warn(JSON.stringify(body));
                throw body.error || (data && data.error) || { message: "User is invalid" };
            }
        })
        .then(function (fbUserResponse) {
            fbUser = JSON.parse(fbUserResponse.body);
            return User.findOne({
                'fb_id': fbUser.id
            }).execAsync();
        })
        .then(function (user) {
            if (!user) {
                logger.info('Registering new user with FB id ' + fbUser.id);
                user = new User({
                    name: fbUser.name,
                    email: fbUser.email,
                    fb_id: fbUser.id,

                });
                return user.saveAsync();
            } else {
                logger.info('User with FB id ' + fbUser.id + ' exists. Updating.');
                return user.updateAsync({
                    updated_at: Date.now()
                });
            }
        })
        .spread(function (rowsAffected, result) {
            if (result.updatedExisting) {
                response.status(200).json(); // Retrieved
            } else {
                response.status(201).json(); // Created
            }
        })
        .catch(function (error) {
            logger.error(error);
            response.status(400).json({
                reason: error
            });
        });
});

router.get('/', function (request, response) {
    var logger = request.app.get('logger');
    User.findAsync({})
        .then(function (users) {
            logger.info('All users succesfully retrieved.');
            response.status(200).json(users);
        })
        .catch(function (error) {
            logger.error('Failed to retrieve all users. Reason: ' + error);
            response.status(400).json({
                reason: error
            });
        });
});

router.get('/:user_id', function (request, response) {
    var logger = request.app.get('logger');
    logger.info('About to retrieve user for id ' + request.params.user_id);
    User.findById(request.params.user_id)
        .execAsync()
        .then(function (user) {
            logger.info('Found a single user succeed. Found: ' + user);
            response.status(200).json(user);
        })
        .catch(function (error) {
            logger.error('Finding a single user failed. Reason: ' + error);
            response.status(400).json({
                reason: error
            });
        });
});

module.exports = router;