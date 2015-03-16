var express = require('express');
var fbManager = require('./../utils/facebookManager');
var router = express.Router();

router.get('/fb/:fb_token', function(request, response) {
    var logger = request.app.get('logger');
    logger.info('Verifying token');
    fbManager.verifyToken(request.params.fb_token)
    .then(function (fbResponse) {
        response.status(200).json(fbResponse);
    })
    .catch(function (error) {
        logger.info(error);
        response.status(400).json(error);
    });
});

module.exports = router;
