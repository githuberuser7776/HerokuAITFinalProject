const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const symptoms = require('./symptoms');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// view engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));

app.use(passport.initialize());
app.use(passport.session());

const Account = require('./models/account');
const savedRecommendations = require('./models/recommendation');
const Feedback = require('./models/feedback')
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// is the environment variable, NODE_ENV, set to PRODUCTION?
let dbconf;
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
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/sw2845';
}

mongoose.connect(dbconf);


app.get('/', function(req, res) {
  res.redirect('WelcomePage');
});

app.get('/WelcomePage', function(req, res) {
  res.render('WelcomePage');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res, next) {
  //console.log('registering user');
  Account.register(new Account({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }
    //console.log('user registered!');
    res.send('registered');
  });
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/AuthFail'
  })
);

app.get('/AuthFail', function(req, res) {
  res.render('AuthFail');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('WelcomePage');
});

app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user.username // get the user out of session and pass to template
        });
    });

app.post('/profile', function(req, res) {
      //console.log("in");
        let symptomArray = [req.body.symptomName, req.body.symptomName1, req.body.symptomName2];
        let severityArray = [parseFloat(req.body.Pain), parseFloat(req.body.Pain1), parseFloat(req.body.Pain2)];
        let reducer = (sum, value) => sum + value;
        let averageSeverity = Math.floor((severityArray.reduce(reducer))/3);
        //console.log(averageSeverity);
        let numberSymptomsT = symptomArray.reduce(function (n, symptom) {
        return n + (symptom == 'None');}, 0);
        let numberSymptoms = Math.floor((3 - numberSymptomsT) * 0.75);
        //console.log(numberSymptoms + "numberOfSymptoms");
        let coldNumber = averageSeverity + numberSymptoms;
        console.log(coldNumber);

      if (coldNumber < 5){
        res.render('notSick');
      }
      else if(coldNumber >= 5 && coldNumber < 11 ){
        res.render('sick');
      }
      else {
        res.render('verySick')
      }
        //console.log(symptomName1 + " " + symptomName2 + " " + symptomName3 + " " + Pain1 + " " + Pain2 + " " + Pain3);
    });
    app.get('/recommend', function(req, res) {
        res.render('recommend', {
            user : req.user.username // get the user out of session and pass to template
        });
    });

    app.post('/recommend', function(req, res) {
        let theRecommendation = req.body.recommendation;
        let thesavedRec = new savedRecommendations({recommendation: theRecommendation});
        thesavedRec.save(function (err){
                    if (err) {
            console.log('error while saving recommendation!', err);
            return handleError(err);
          }
        });
        res.render('recommendSaved', {theRecommendation:theRecommendation, user:req.body.username});
    });

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

app.get('/allRecs', function(req, res) {
  savedRecommendations.distinct("recommendation", function(err, items) {
           if(err) {
               return console.log('find error:', err);
           }
           else {
             let numberSymptomsT = items.reduce(function (n, symptom) {
             return n + 1;}, 0);
             res.render('allRecs', {items:items, numberSymptomsT:numberSymptomsT});
          }
       });
});

app.get('/feedback', function(req, res) {
    res.render('feedback');
  });

  app.post('/feedback', function(req, res) {
      let theFeedback = req.body.feedback;
      let thesavedFeedBack = new Feedback({feedback: theFeedback});
      thesavedFeedBack.save(function (err){
                  if (err) {
          console.log('error while saving recommendation!', err);
          return handleError(err);
        }
      });
      res.render('feedbackSaved');
  });

module.exports = app;
app.listen(process.env.PORT||3000);
