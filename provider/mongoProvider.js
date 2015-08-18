/**
 * Created by Sean on 1/28/2015.
 */
var path = require('path');
var mongoose = require('mongoose');
mongoose.set('debug', true);

// get application configuration (would be better if this was a separate config file)
var config = require(path.join(__dirname, "../config/configProvider"));

mongoose.connect(config.database.url);
var Schema = mongoose.Schema;

// Model Schema
var gameSchema = new Schema({
  Name : String,
  NumberOfPlayers : String,
  BGGLink : String,
  OwnerID : String,
  OwnerName: String,
  Comment : String
});

var GameModel = mongoose.model("Game", gameSchema);

// Repository
var GameRepository = function(){};

GameRepository.prototype.findAll = function(callback) {
  GameModel.find({}).sort({Name:'asc'}).exec(function(err, games){
    callback(games);
  });
};

GameRepository.prototype.save = function(game, user, callback) {
  game.OwnerID = user.id;
  game.OwnerName = user.displayName;
  var instance = new GameModel(game);
  instance.save(function(err){
    callback();
  });
};

GameRepository.prototype.delete = function(gameID, user, callback) {
  console.log("game id: " + gameID + " " + user.id);
  GameModel.remove({_id: gameID, OwnerID: user.id}, function(err){
    callback();
  });
}

module.exports.GameRepository = GameRepository;
