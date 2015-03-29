var Promise = require("bluebird");
var mongoose = Promise.promisifyAll(require("mongoose"));

module.exports = mongoose;