
let mongoose = require('mongoose');

require('./models/account.js');
require('./models/feedback.js');
require('./models/recommendation.js');

let dbconf;

if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);
 console.log("hello");

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);

 dbconf = conf.dbconf;
 console.log(dbconf);
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/sw2845';
}

mongoose.connect(dbconf);
/*var mongoose = require('mongoose/');

var Schema = mongoose.Schema;

var UserDetail = new Schema({
      username: String,
      password: String
    }, {
      collection: 'userInfo'
    });
var UserDetails = mongoose.model('userInfo', UserDetail);
/*
const User = new mongoose.Schema({
	username : String,
	passwordHash: String,
	diseases: [Diseases]
	});
const Diseases = new mongoose.Schema({
	user:User,
	diseaseName: String,
	symptoms: [String],
	treatmentSteps: [TreatmentSteps],
	});
const TreatmentSteps = new mongoose.Schema({
	disease: Diseases,
	treatmentName: String,
	links: [String, String]
});

mongoose.model("User",User);
mongoose.model("Deseases", Diseases);
mongoose.model("TreatmentSteps", TreatmentSteps);

// is the environment variable, NODE_ENV, set to PRODUCTION?
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 let dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/sw2845';
}

mongoose.connect(dbconf);
*/
