var mongoose = require('mongoose/');

var Schema = mongoose.Schema;

const Feedback = new Schema({
  feedback:String
});

module.exports = mongoose.model('Feedback', Feedback);
