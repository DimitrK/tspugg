var logger = require('./../log');
var mongoose = require("./../utils/mongoose-bluebird");
var fbManager = require("./../utils/facebookManager");
var Idea = require('./idea');

var userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    fb_id: {
        type: String,
        index: true
    },
    email: {
        type: String,
        lowercase: true
    },
    updated_at: {
        type: Date
    },
    created_at: {
        type: Date
    },
    ideas: [Idea.schema]
});

/**
 *  Schema Hooks
 */ 
userSchema.pre('save', function(next){
  var now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

userSchema.post('validate', function (doc) {
  logger.info('User has been validated (but not saved yet). ID: ' + doc._id);
});

userSchema.post('save', function (doc) {
  logger.info('User has been saved. ID:' + doc._id);
});

/**
 * Virtual getters
 */ 
userSchema.virtual('photo').get(function () {
    return fbManager.buildUserPhotoUrl(this.fb_id);
});

/**
 * Serialization options
 */ 
userSchema.set('toJSON', { getters: true, virtuals: true });

userSchema.set('toObject', { getters: true, virtuals: true });


var User = mongoose.model('User', userSchema);

module.exports = User;