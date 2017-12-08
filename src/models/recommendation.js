var mongoose = require('mongoose/');

var Schema = mongoose.Schema;

const savedRecommendations = new Schema({
  recommendation: String
});

module.exports = mongoose.model('savedRecommendations', savedRecommendations);
