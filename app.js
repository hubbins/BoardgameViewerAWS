var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var winston = require('winston');
var expressWinston = require('express-winston');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

var port = process.env.PORT || 3000;

// get application configuration
var config = require(path.join(__dirname, "/config/configProvider"));

// get database provider
var dbProvider = require(path.join(__dirname, "provider/" + config.database.provider));
var gameProvider = new dbProvider.GameRepository();

var app = express();

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: config.security.GOOGLE_CLIENT_ID,
    clientSecret: config.security.GOOGLE_CLIENT_SECRET,
    callbackURL: config.security.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      //console.log(profile);
      // lookup user in the database using the 'id' and return that user
      return done(null, profile);
    });
  }
));

var logger = expressWinston.logger({
    transports:[
        new (winston.transports.Console)({
            colorize: true,
            json: false
        })
    ],
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}\n{{'connect.sid=' + req.cookies['connect.sid']}}\n"
});

var errorLogger = expressWinston.errorLogger({
    transports:[
        new (winston.transports.Console)({
            colorize: true,
            json: false
        })
    ],
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}"
});

app.use(logger);

// configure Express
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(methodOverride());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ resave: true, saveUninitialized: true, secret: config.security.SESSION_SECRET }));
app.use(express.static(path.join(__dirname, '/public')));



// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.all('*', function(req, res, next){
  // can do something here for every request
  console.log("Auth: " + req.isAuthenticated());
  //console.log(req.user);
  next();
});

// configure routes
app.get('/', function(req, res){
  res.render('viewer', { user: req.user });
});

// get current user
app.get('/api/user', function(req, res) {
  res.send({user: req.user});
});

// service to get list of games
app.get('/api/games', function(req, res){
  gameProvider.findAll(function (games) {
    res.send(games);
  });
});

// service to set a game, must be authenticated
app.post('/api/game', function(req, res){
  if (req.isAuthenticated()) {
    gameProvider.save(req.body, req.user, function () {
      res.send({Status: "Success"});
    });
  } else {
    res.sendStatus(401);
  }
});

// service to delete a game, must be authenticated
app.delete('/api/game/:id', function(req, res){
  if (req.isAuthenticated()) {
    gameProvider.delete(req.params.id, req.user, function () {
      res.send({Status: "Success"});
    });
  } else {
    res.sendStatus(401);
  }
});



/*
app.get('/account', ensureAuthenticated, function(req, res){
  //console.log(req.user);
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});
*/
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: config.security.googleScope }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use(errorLogger);

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}
