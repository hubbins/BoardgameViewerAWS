var path = require('path');

// load configuration for this environment
var env = process.env.SERVER_ENV || "DEV";   // default to DEV if SERVER_ENV not set
var config = require(path.join(__dirname + "/config-" + env));

module.exports = config;
