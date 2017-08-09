const db = require('./db');
const express = require('express');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routers/home');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash-messages');

// require stuff for passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// mongoose. not a mammal
const mongoose = require('mongoose');
// bluebird is a promise library. checkout bluebirdjs.org
const bluebird = require('bluebird');

const Login = require('./models/login');

passport.use(
  new LocalStrategy(function(name, password, done) {
    console.log('LocalStrategy', name, password);
    User.authenticate(name, password)
      // success!!
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, null, {
            message: 'There was no user with this email and password.'
          });
        }
      })
      // there was a problem
      .catch(err => done(err));
  })
);

// store the user's id in the session
passport.serializeUser((user, done) => {
  console.log('serializeUser');
  done(null, user.id);
});

// get the user from the session based on the id
passport.deserializeUser((id, done) => {
  console.log('deserializeUser');
  User.findById(id).then(user => done(null, user));
});

// set mongoose's primise library to be bluebird
mongoose.Promise = bluebird;



const app = express();

app.use(express.static('public'));

let url = 'mongodb://localhost:27017/newdb';

app.engine('handlebars', exphbs());
app.set('views', './views');
app.set('view engine', 'handlebars');

app.use(
  session({
    secret: 'keyboard kitten',
    resave: false,
    saveUninitialized: true
  })
);

// connect passport to express boilerplate
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//tell express to use the bodyParser middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// this middleware function will check to see if we have a user in the session.
// if not, we redirect to the login form.
const requireLogin = (req, res, next) => {
    console.log('req.user', req.user);
    if (req.user) {
      next();
    } else {
      res.redirect('/login');
    }


    app.use('/', homeRoutes);

    app.get('/login', (req, res) => {
      //console.log('errors:', res.locals.getMessages());
      res.render('login', {
        failed: req.query.failed
      });
    });

    app.post(
      '/login',
      passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login?failed=true',
        failureFlash: true
      })
    );



    db.connect(url, (err, connection) => {
      if (!err) console.log('connected to mongo');

      app.listen(3000, () => console.log('up and running'));
    });
