"use strict";
console.log("Starting...");

var fs = require('fs');
var EventEmitter = require('events');
var event = new EventEmitter();
global.event = event;

var Game = require('./game');
var Maze = require('./maze');
var Player = require('./player');

var Bot = require('./bot')
var bot = new Bot(require('./bata_config'));

//var Player2 = require('./player');
//var Player3 = require('./player');

global.settings = {since_id: 1, game_id: 10};
//global.settings = settings;

function readObjFromFile(fileName, o) {
    try {
        o = require('./' + fileName + '.json');
    }
    catch (e) {
        console.log(fileName + ".json not found!");
    }
}

function readSettings() {
    readObjFromFile('settings', global.settings);
    //settings.game_id++;
}

function saveObjToFile(fileName, o) {
    fs.writeFile('./' + fileName + '.json', JSON.stringify(o), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(fileName + ".json was saved!");
    });
}

function saveSettings() {
    /*fs.writeFile('./settings.json', JSON.stringify(settings), function(err) {
     if(err) {
     return console.log(err);
     }
     console.log("Settings were saved!");
     });*/
    saveObjToFile('settings', global.settings);
}

readSettings();

Maze.init();
Maze.addObstacles();
//Maze.print();

//var players = [];

var game = new Game(global.settings, bot);

/*
 setInterval(function() {
 game.run();

 saveSettings();
 }, 40000);
 */

game.start();

//saveSettings();
event.emit('registration');


function handleError(err) {
    console.error('response status:', err.statusCode);
    console.error('data:', err.data);
}