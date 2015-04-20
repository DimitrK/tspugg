var mongoose = require("./../utils/mongoose-bluebird");
var logger = require('./../log');

var ideaSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    likes: {
        type: Number
    },
    dateCreated: {
        type: Date
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId
    }
});

ideaSchema.path('title').validate(function (value) {
    return !!value && value.length > 1;
});


ideaSchema.path('content').validate(function (value) {
    return !!value && value.length > 10;
});

ideaSchema.post('validate', function (doc) {
  logger.info('Idea has been validated (but not saved yet). ID:'+ doc._id);
});

ideaSchema.post('save', function (doc) {
  logger.info('Idea has been saved. ID:'+ doc._id);
});

var Idea = mongoose.model('Idea', ideaSchema);

module.exports = Idea;