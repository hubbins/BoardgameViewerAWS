var path = require('path');
var pg = require('pg');
var config = require(path.join(__dirname, "../config/configProvider"));

// Repository
var GameRepository = function(){};

GameRepository.prototype.findAll = function(callback) {
    pg.connect(config.database.url, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        var query = client.query('SELECT "ID", info FROM game.game ORDER BY info->>\'Name\' ASC', [], function(err, result) {
            done();

            if(err) {
                return console.error('error running query', err);
            }

            client.end();
        });

        // create an array to concatenate all the rows to return
        var games = [];

        query.on('row', function(row){
            row.info._id = row.ID;      // emulate the MongoDB _id behavior
            games.push(row.info);
        });

        query.on('end', function(){
            callback(games);
        });
    });
};

GameRepository.prototype.save = function(game, user, callback) {
    game.OwnerID = user.id;
    game.OwnerName = user.displayName;
    pg.connect(config.database.url, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO game.game (info) VALUES ($1)', [game], function(err, result) {
            done();
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            callback();
        });
    });
};

GameRepository.prototype.delete = function(gameID, user, callback) {
    pg.connect(config.database.url, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('DELETE FROM game.game WHERE "ID"=$1 AND info->>\'OwnerID\'=$2', [gameID, user.id], function(err, result) {
            done();
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            callback();
        });
    });
};

module.exports.GameRepository = GameRepository;

/*
 -- DROP DATABASE games;

 CREATE DATABASE games
 WITH OWNER = postgres
 ENCODING = 'UTF8'
 TABLESPACE = pg_default
 LC_COLLATE = 'English_United States.1252'
 LC_CTYPE = 'English_United States.1252'
 CONNECTION LIMIT = -1;

 CREATE SCHEMA game
 AUTHORIZATION postgres;

 -- DROP TABLE game.game;

 CREATE TABLE game.game
 (
 "ID" serial NOT NULL,
 info jsonb,
 CONSTRAINT pk_game PRIMARY KEY ("ID")
 )
 WITH (
 OIDS=FALSE
 );
 ALTER TABLE game.game
 OWNER TO postgres;

 -- Index: game.idx_info

 -- DROP INDEX game.idx_info;

 CREATE INDEX idx_info
 ON game.game
 USING gin
 (info);

 */