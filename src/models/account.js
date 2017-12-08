let mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
  username: String,
  password: String,
  prevSearches: []
});

const savedRecommendations = new Schema({
  recommendation: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
//module.exports = mongoose.model('savedRecommendations', savedRecommendations);
