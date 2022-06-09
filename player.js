"use strict";
//id: -1,
//    name: "Nameless" + Math.floor(Math.random() * 10000),
//    x: 1,
//    y: 1,

var Player = function(id, name, x, y) {
        this.id = id || -1;
        this.name = name || "Nameless" + Math.floor(Math.random() * 10000);
        this.HP = 1;
        this.x = x || 1;
        this.y = y || 1;

        this.commands = [];

        console.log("Created player", this.name, this.x, this.y);
        return this;
};

Player.prototype.toString = function () {
    return this.name + "/" + this.id;
};

Player.prototype.clearCommands = function () {
    this.commands = [];
    console.log("Clear commands", this.toString());
};

module.exports = Player;
