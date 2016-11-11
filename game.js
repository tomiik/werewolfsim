"use strict";
var gameMaster_1 = require("./gameMaster");
var no_of_wolves = 2;
var no_of_villagers = 5;
var gamemaster = new gameMaster_1.default();
gamemaster.createPlayers(no_of_wolves, no_of_villagers);
gamemaster.play();
