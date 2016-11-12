"use strict";
var gameMaster_1 = require("./gameMaster");
var enum_1 = require("./enum");
var no_of_wolves = 3;
var no_of_villagers = 10;
var winner;
var gamemaster;
var wolves = 0;
var villagers = 0;
for (var i = 0; i < 1; i++) {
    gamemaster = new gameMaster_1.default(no_of_wolves, no_of_villagers);
    winner = gamemaster.play();
    if (winner == enum_1.GameStatus.End_Wolves_Won) {
        wolves++;
    }
    else if (winner == enum_1.GameStatus.End_Villagers_Won) {
        villagers++;
    }
}
console.log("wolves:" + wolves);
console.log("villagers:" + villagers);
