// create and export config
var config = {};
module.exports = config;

// all security-related configuration
config.security = {};

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
config.security.GOOGLE_CLIENT_ID = "410235477923-6s6luna7dmsjj28gu6pq7jitumr6mfgp.apps.googleusercontent.com";
config.security.GOOGLE_CLIENT_SECRET = "SECRET";
config.security.callbackURL = "http://127.0.0.1:3000/auth/google/callback";
config.security.googleScope = ['https://www.googleapis.com/auth/userinfo.profile'/*, 'https://www.googleapis.com/auth/userinfo.email'*/];

config.security.SESSION_SECRET = "somesecret";

// database config
config.database = {}
config.database.provider = "mongoProvider";
config.database.url = 'mongodb://localhost/games';

//config.database.provider = "postgresProvider";
//config.database.url = "postgres://postgres:password@localhost/games";

