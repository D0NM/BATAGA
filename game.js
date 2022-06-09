"use strict";
// Created by bmv on 03.11.2015.

var fs = require('fs');
//var EventEmitter = require('events');
var Player = require('./player');
var players = [];
var turn = 0;

var event = global.event;

var bot = null;

var Game = function (settings_, bot_) {
    console.log("Game created"/*, settings.game_id*/);
    //settings = settings_;
    bot = bot_;
    turn = 1;
};

function handleError(err) {
    console.error('response status:', err.statusCode);
    console.error('data:', err.data);
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
    saveObjToFile('settings', global.settings);
}

function onRegistration() {
    console.log("Game N " + global.settings.game_id);
    turn = 1;
    players = [];
    var plrs = [];
    var since_id = global.settings.since_id;
    bot.twit.get('direct_messages', {count: 20, since_id: global.settings.since_id}, function (err, dm) {
        if (err) return handleError(err);
        console.log('# direct msgs:' + dm.length.toString(), " since_id:" + since_id);
        for (var i = 0; i < dm.length; i++) {
            var d = dm[i];
            if (d.text.toLowerCase() == "join") {

                if (plrs.some(function (p) {
                        return p.id == d.sender_id;
                    }))
                    continue;

                //d.sender_id,
                console.log(d.sender_screen_name, d.text, d.id);

                plrs.push(new Player(d.sender_id, '@' + d.sender_screen_name, 1 + i, 1));

                if (since_id < d.id)
                    since_id = d.id;
            }
        }
        //saveSettings();
        if (plrs.length > 1) {
            var names = plrs.reduce(function(sum, current) {
                    return sum +current.name+" ";
                }, "");

            console.log('Registered ' + plrs.length + ' players: ' + names);
            players = plrs;
            global.settings.since_id = since_id + 1;
            saveSettings();
            //event.emit('waitPlayers');
            setTimeout(function() {global.event.emit('waitPlayers');}, 10000);
        } else {
            console.log('Game needs 2 or more players. Lets wait.');
            setTimeout(function() {global.event.emit('registration');}, 90000);
        }
    });
}

function onWaitPlayers() {
    var names = players.reduce(function(sum, current) {
        if(current.HP <= 0)
            return sum;
        return sum +current.name+" ";
    }, "");
    var text = "Turn "+turn+". ";
    switch(Math.floor(Math.random()*4)){
        case 0:
            text += "Any pidor might die at any turn.";
            break;
        case 1:
            text += "Chiki-briki.";
            break;
        case 2:
            text += "Well well well... Who is P?";
            break;
        case 3:
            text += "You have 1 minute.";
            break;
        case 4:
            text += "DM me to join the game, remember?";
            break;
    }
    if(Math.random()<0.5)
        text += "\nWaiting for your commands: "+names;
    else
        text += "\n"+names+", I need your commands.";
    console.log(text);
    bot.twit.post('statuses/update', {status: text}, function (err, dm) {
        if (err) return handleError(err);
    });
    //event.emit('processTurn');
    setTimeout(function() {global.event.emit('processTurn');}, 60000);
}
function onProcessTurn() {
    var names = players.reduce(function(sum, current) {
        return sum +current.name+" ";
    }, "");
    console.log("* Processing "+turn+" Turn: "+names);
    //event.emit('endTurn');
    setTimeout(function() {global.event.emit('endTurn');}, 5000);
}

function onEndTurn() {
    console.log("* End of "+turn+" Turn");
    turn++;
    //temp TODO remove
    for(var i=0; i<players.length; i++){
        if(Math.random()<0.25)
            players[i].HP = 0;
    }
    //count alive players
    var count = 0;
    for(var i=0; i<players.length; i++){
        if(players[i].HP > 0)
            count++;
    }

    if (count < 2 ) {
        //event.emit('gameOver');
        setTimeout(function() {global.event.emit('gameOver');}, 5000);
    } else {
        //event.emit('waitPlayers');
        setTimeout(function() {global.event.emit('waitPlayers');}, 10000);
    }
}

function onGameOver() {
    console.log("* Game Over");
    var text = "";
    //count alive players
    var count = 0;
    for(var i=0; i<players.length; i++){
        if(players[i].HP > 0)
            count++;
    }
    if(count > 0) {
        var names = players.reduce(function (sum, current) {
            if (current.HP <= 0)
                return sum;
            return sum + current.name + " ";
        }, "");
        text = "GAME #" + global.settings.game_id + " IS OVER!\nThe winner is " + names + " !";
    } else {
        text = "GAME #" + global.settings.game_id + " IS OVER!\nWe have no winners here. Everyone is pidor";
    }
    console.log(text);
    bot.twit.post('statuses/update', {status: text}, function (err, dm) {
        if (err) return handleError(err);
    });
    if (true) {
        global.settings.game_id++;
        //event.emit('registration');
        setTimeout(function() {global.event.emit('registration');}, 10000);
    }
}

Game.prototype.start = function () {
    event.on('registration', onRegistration);
    event.on('waitPlayers', onWaitPlayers);
    event.on('processTurn', onProcessTurn);
    event.on('endTurn', onEndTurn);
    event.on('gameOver', onGameOver);

    //event.emit('registration');
};

module.exports = Game;
