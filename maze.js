"use strict";
//
// make maze

function randIndex(arr) {
    var index = Math.floor(arr.length * Math.random());
    return arr[index];
};

var M_WALL = '#';
var M_SPACE = '.';
var M_OBSTACLE = 'X';

var width = 13;
var height = 7;
var i;
var m;

var Maze = {};

Maze.init = function () {
    m = [];
    for (var i = 0; i < height; i++) {
        m[i] = [];
        for (var j = 0; j < width; j++) {
            m[i][j] = M_SPACE;
        }
    }
    for (var i = 0; i < height; i++) {
        m[i][0] = m[i][width - 1] = M_WALL;
    }
    for (var j = 0; j < width; j++) {
        m[0][j] = m[height - 1][j] = M_WALL;
    }
    return m;
}

Maze.addObstacles2 = function (n) {
    if (!n || n < 0)
        n = 5;

    for (var i = 0; i < n; i++) {
        var j = Math.floor(Math.random() * width);
        var i = Math.floor(Math.random() * height);
        m[i][j] = M_OBSTACLE;
    }
    return m;
}

Maze.addObstacles = function (n) {
    if (!n || n < 0)
        n = 0.15;
    for (var i = 1; i < height - 1; i++) {
        for (var j = 1; j < width - 1; j++) {
            if (Math.random() < n)
                m[i][j] = M_OBSTACLE;
        }
    }
    return m;
}


Maze.print = function () {
    var t = "";
    for (var i = 0; i < height; i++) {
        t = "";
        for (var j = 0; j < width; j++) {
            t += m[i][j];
        }
        console.log(t);
    }
}

//console.log(Maze);

module.exports = Maze;
