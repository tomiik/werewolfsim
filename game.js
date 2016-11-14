"use strict";
var readlineSync = require('readline-sync');
var gameMaster_1 = require("./gameMaster");
var enum_1 = require("./enum");
var no_of_wolves = readlineSync.question("Please input the number of wolves. >");
var no_of_villagers = readlineSync.question("Please input the number of villagers. >");
var games = readlineSync.question("Please input the number of games. >");
no_of_wolves = parseInt(no_of_wolves);
no_of_villagers = parseInt(no_of_villagers);
games = parseInt(games);
var winner;
var gamemaster;
var wolves = 0;
var villagers = 0;
for (var i = 0; i < games; i++) {
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
