var express = require('express');
var Idea = require('./../models/idea');
var router = express.Router();


router.get('/', function (request, response) {
    var logger = request.app.get('logger');
    Idea.findAsync({})
        .then(function (ideas) {
            logger.info('All ideas succesfully retrieved.');
            response.status(200).json(ideas);
        })
        .catch(function (error) {
            logger.error('Failed to retrieve all ideas. Reason: ' + error);
            response.status(400).json({
                reason: error
            });
        });
});

router.get('/:idea_id', function (request, response) {
    var logger = request.app.get('logger');
    logger.info('About to retrieve idea for id ' + request.params.idea_id);
    Idea.findById(request.params.idea_id)
        .execAsync()
        .then(function (idea) {
            logger.info('Found a single idea succeed. Found: ' + idea);
            response.status(200).json(idea);
        })
        .catch(function (error) {
            logger.error('Finding a single idea failed. Reason: ' + error);
            response.status(400).json({
                reason: error
            });
        });
});

router.post('/', function (request, response) {
    var logger = request.app.get('logger');
    logger.info('About to save a new idea');
    var idea = new Idea(request.body);
    idea.saveAsync()
        .then(function(){
            logger.error('Idea just born!');
            response.status(201).json(idea);
        })
        .catch(function(error){
            logger.error('Finding a single idea failed. Reason: ' + error);
            response.status(400).json({
                reason: error
            });
        });
    
});

module.exports = router;