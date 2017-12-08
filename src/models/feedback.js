var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const Feedback = new Schema({
  feedback:String
});

mongoose.model('Feedback', Feedback);
