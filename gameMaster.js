"use strict";
var enum_1 = require("./enum");
var villager_1 = require("./players/villager");
var wolf_1 = require("./players/wolf");
var players = [];
var GameMaster = (function () {
    function GameMaster() {
    }
    GameMaster.prototype.play = function () {
        var gamestatus = enum_1.GameStatus.Not_End;
        for (var i = 0; i < 10; i++) {
            console.log("============== day " + i + "==============");
            this.nightEvents();
            this.checkPlayers();
            gamestatus = this.checkGameOver();
            if (gamestatus == enum_1.GameStatus.End_Wolves_Won) {
                console.log("~~~~~~~~~~~~~~ Wolves Won ~~~~~~~~~~~~~~~~");
                return gamestatus;
            }
            else if (gamestatus == enum_1.GameStatus.End_Villagers_Won) {
                console.log("~~~~~~~~~~~~~~ Villagers Won ~~~~~~~~~~~~~~~~");
                return gamestatus;
            }
            this.dayEvents();
            this.checkPlayers();
            gamestatus = this.checkGameOver();
            if (gamestatus == enum_1.GameStatus.End_Wolves_Won) {
                console.log("~~~~~~~~~~~~~~ Wolves Won ~~~~~~~~~~~~~~~~");
                return gamestatus;
            }
            else if (gamestatus == enum_1.GameStatus.End_Villagers_Won) {
                console.log("~~~~~~~~~~~~~~ Villagers Won ~~~~~~~~~~~~~~~~");
                return gamestatus;
            }
        }
    };
    GameMaster.prototype.checkPlayers = function () {
        console.log("----------------------------------------------");
        for (var i = 0; i < players.length; i++) {
            console.log(players[i].getId() + ":" + enum_1.PlayerType[players[i].getType()] + "\t: " + enum_1.PlayerStatus[players[i].getStatus()]);
        }
        console.log("----------------------------------------------");
    };
    GameMaster.prototype.createPlayers = function (no_of_wolves, no_of_villagers) {
        var no_of_players = no_of_wolves + no_of_villagers;
        for (var i = 0; i < no_of_wolves; i++) {
            players.push(new wolf_1.NormalWolf);
        }
        players.push(new villager_1.Doctor);
        players.push(new villager_1.NormalVillager);
        players.push(new villager_1.NormalVillager);
        players.push(new villager_1.NormalVillager);
        players.push(new villager_1.NormalVillager);
        players.push(new villager_1.NormalVillager);
        players.push(new villager_1.NormalVillager);
        players.push(new villager_1.NormalVillager);
        players.push(new villager_1.NormalVillager);
        players.push(new villager_1.NormalVillager);
        for (var i = 0; i < players.length; i++) {
            players[i].clearWhitelist(no_of_players);
            if (players[i].getType() == enum_1.PlayerType.NormalWolf) {
                players[i].identifyWolves(players);
            }
        }
    };
    GameMaster.prototype.selectWolfLeader = function () {
        for (var i = 0; i < players.length; i++) {
            if (players[i].type == enum_1.PlayerType.NormalWolf && players[i].getStatus() == enum_1.PlayerStatus.Healthy) {
                players[i].setLeader();
                return true;
            }
        }
        return false;
    };
    GameMaster.prototype.nightEvents = function () {
        console.log("--night start");
        //wolf
        this.selectWolfLeader();
        for (var i = 0; i < players.length; i++) {
            players[i].action(players);
        }
        console.log("--night end");
        this.statusUpdate();
    };
    GameMaster.prototype.dayEvents = function () {
        var accuseResult = this.accuse();
        console.log(accuseResult);
        var voteResult = this.vote(accuseResult);
        console.log(voteResult);
    };
    GameMaster.prototype.accuse = function () {
        console.log("accuse()");
        var accuse;
        var accusedScore = [];
        //initialize accuse Score
        for (var i = 0; i < players.length; i++) {
            accusedScore[i] = [i, 0];
        }
        //accuse
        for (var i = 0; i < players.length; i++) {
            accuse = players[i].accuse(players);
            accusedScore[accuse] = [accuse, accusedScore[accuse][1] + 1];
        }
        accusedScore.sort(function (a, b) { return b[1] - a[1]; });
        return accusedScore;
    };
    GameMaster.prototype.vote = function (accusedResult) {
        console.log("vote()");
        var vote;
        var votedScore = [];
        //initialize accuse Score
        for (var i = 0; i < players.length; i++) {
            votedScore[i] = [i, 0];
        }
        //vote
        for (var i = 0; i < players.length; i++) {
            vote = players[i].vote(accusedResult, players);
            votedScore[vote] = [vote, votedScore[vote][1] + 1];
        }
        votedScore.sort(function (a, b) { return b[1] - a[1]; });
        console.log("player" + players[votedScore[0][0]].getId() + "[" + players[votedScore[0][0]].getType() + "] was executed.");
        players[votedScore[0][0]].killed();
        return votedScore;
    };
    GameMaster.prototype.statusUpdate = function () {
        for (var i = 0; i < players.length; i++) {
            if (players[i].getStatus() == enum_1.PlayerStatus.Attacked) {
                console.log("Player" + players[i].getId() + "[" + enum_1.PlayerType[players[i].getType()] + "] was killed.");
                players[i].killed();
            }
        }
    };
    GameMaster.prototype.checkGameOver = function () {
        var wolves = 0;
        var alives = 0;
        var result = enum_1.GameStatus.Not_End;
        for (var i = 0; i < players.length; i++) {
            if (players[i].getStatus() != enum_1.PlayerStatus.Dead) {
                alives++;
                if (players[i].getType() == enum_1.PlayerType.NormalWolf) {
                    wolves++;
                }
            }
        }
        console.log("Alives:" + alives + " Wloves:" + wolves + " Villagers:" + (alives - wolves));
        if (wolves >= (alives - wolves)) {
            result = enum_1.GameStatus.End_Wolves_Won;
        }
        else if (wolves == 0) {
            result = enum_1.GameStatus.End_Villagers_Won;
        }
        return result;
    };
    ;
    return GameMaster;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameMaster;
