// create and export config
var config = {};
module.exports = config;

// all security-related configuration
config.security = {};

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
config.security.GOOGLE_CLIENT_ID = "410235477923-6s6luna7dmsjj28gu6pq7jitumr6mfgp.apps.googleusercontent.com";
config.security.GOOGLE_CLIENT_SECRET = "SECRET";
config.security.callbackURL = "http://default-environment-giz52ca2yn.elasticbeanstalk.com/auth/google/callback";
config.security.googleScope = ['https://www.googleapis.com/auth/userinfo.profile'/*, 'https://www.googleapis.com/auth/userinfo.email'*/];

config.security.SESSION_SECRET = "somesecret";

// database config
config.database = {}

config.database.provider = "postgresProvider";
config.database.url = "postgres://postgres:SECRET@aasbxb491rwmk6.c0iriragsnea.us-east-1.rds.amazonaws.com/games";

