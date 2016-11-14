"use strict";
var readlineSync = require('readline-sync');
var gameMaster_1 = require("./gameMaster");
var enum_1 = require("./enum");
var no_of_players = readlineSync.question("Please input the number of players. >");
;
var games = readlineSync.question("Please input the number of games. >");
var winner;
var gamemaster;
for (var j = Math.ceil(no_of_players / 20); j < no_of_players / 2; j++) {
    var no_of_wolves = j;
    var no_of_villagers = no_of_players - no_of_wolves;
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
    console.log("wolves:" + no_of_wolves + " villagers:" + no_of_villagers + " -> wolves:" + Math.round(100 * wolves / games) + "% / villagers:" + Math.round(100 * villagers / games) + "%");
    if (wolves > villagers) {
        break;
    }
}
