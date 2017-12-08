var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const savedRecommendations = new Schema({
  recommendation: String
});

mongoose.model('savedRecommendations', savedRecommendations);
