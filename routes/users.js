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
            var data = JSON.parse(fbVerifyResponse.body).data;
            if( data.is_valid ) {
                return fbManager.getUser(request.params.fb_token);
            } else {
                response.status(400).json({reason: "Facebook returned invlaid user"});
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
                user = new User({
                    name: fbUser.name,
                    email: fbUser.email,
                    fb_id: fbUser.id,
                    
                });
                return user.saveAsync();
            } else {
                return user.updateAsync({updated_at: Date.now()});
            }
        })
        .spread(function (rowsAffected, result) {
            if( result.updatedExisting ) {
                response.status(200).json();// Retrieved
            } else {
                response.status(201).json();// Created
            }
        })
        .catch(function (error) {
            logger.info(error);
            response.status(400).json({reason: error});
        });
});

module.exports = router;