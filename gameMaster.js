"use strict";
var enum_1 = require("./enum");
var villager_1 = require("./players/villager");
var wolf_1 = require("./players/wolf");
var log_CheckStatus = true;
var log_Accuse = false;
var log_Vote = false;
var GameMaster = (function () {
    function GameMaster() {
        this.lastVoteResult = [];
        this.players = [];
        this.players_queue = [];
    }
    GameMaster.prototype.play = function () {
        var lastVoteResult = [];
        var gamestatus = enum_1.GameStatus.Not_End;
        for (var i = 0; i < 10; i++) {
            console.log();
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
        if (log_CheckStatus == true) {
            console.log("----------------------------------------------");
            for (var i = 0; i < this.players.length; i++) {
                console.log(this.players[i].getId() + ":" + enum_1.PlayerType[this.players[i].getType()] + "\t: " + enum_1.PlayerStatus[this.players[i].getStatus()]);
            }
            console.log("----------------------------------------------");
        }
    };
    GameMaster.prototype.createPlayers = function (no_of_wolves, no_of_villagers) {
        var no_of_players = no_of_wolves + no_of_villagers;
        this.createWolves(no_of_wolves);
        this.players_queue = [new villager_1.Doctor(), new villager_1.Cop(), new villager_1.Diseased(), new villager_1.Vigilante(), new wolf_1.Rogue()];
        this.createVillagers(no_of_villagers);
        this.initializePlayers();
    };
    GameMaster.prototype.initializePlayers = function () {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].clearWhitelist(this.players.length);
            if (this.players[i].getType() == enum_1.PlayerType.NormalWolf) {
                this.players[i].identifyWolves(this.players);
            }
        }
    };
    GameMaster.prototype.createWolves = function (num) {
        for (var i = 0; i < num; i++) {
            this.players.push(new wolf_1.NormalWolf);
        }
    };
    GameMaster.prototype.createVillagers = function (num) {
        for (var i = 0; i < num; i++) {
            if (this.players_queue.length > 0) {
                this.players.push(this.players_queue.shift());
            }
            else {
                this.players.push(new villager_1.NormalVillager);
            }
        }
    };
    GameMaster.prototype.selectWolfLeader = function () {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].type == enum_1.PlayerType.NormalWolf && this.players[i].getStatus() == enum_1.PlayerStatus.Healthy) {
                this.players[i].setLeader();
                return true;
            }
        }
        return false;
    };
    GameMaster.prototype.nightEvents = function () {
        console.log("------------- Night -------------");
        //wolf
        this.selectWolfLeader();
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].getStatus() != enum_1.PlayerStatus.Dead) {
                this.players[i].action(this.players, this.lastVoteResult);
            }
        }
        this.statusUpdate();
    };
    GameMaster.prototype.dayEvents = function () {
        console.log("-------------  Day  -------------");
        var accuseResult = this.accuse();
        if (log_Accuse == true) {
            console.log(accuseResult);
        }
        this.lastVoteResult = this.vote(accuseResult);
        if (log_Vote == true) {
            console.log(this.lastVoteResult);
        }
    };
    GameMaster.prototype.accuse = function () {
        if (log_Accuse == true) {
            console.log("accuse()");
        }
        var accuse;
        var accusedScore = [];
        //initialize accuse Score
        for (var i = 0; i < this.players.length; i++) {
            accusedScore[i] = [i, 0];
        }
        //accuse
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].getStatus() != enum_1.PlayerStatus.Dead) {
                accuse = this.players[i].accuse(this.players);
                accusedScore[accuse] = [accuse, accusedScore[accuse][1] + 1];
            }
        }
        accusedScore.sort(function (a, b) { return b[1] - a[1]; });
        return accusedScore;
    };
    GameMaster.prototype.vote = function (accusedResult) {
        if (log_Vote == true) {
            console.log("vote()");
        }
        var vote;
        var votedScore = [];
        //initialize accuse Score
        for (var i = 0; i < this.players.length; i++) {
            votedScore[i] = [i, 0];
        }
        //vote
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].getStatus() != enum_1.PlayerStatus.Dead) {
                vote = this.players[i].vote(accusedResult, this.players);
                votedScore[vote] = [vote, votedScore[vote][1] + 1];
            }
        }
        votedScore.sort(function (a, b) { return b[1] - a[1]; });
        console.log("player" + this.players[votedScore[0][0]].getId() + "[" + enum_1.PlayerType[this.players[votedScore[0][0]].getType()] + "] was executed.");
        this.players[votedScore[0][0]].killed();
        return votedScore;
    };
    GameMaster.prototype.statusUpdate = function () {
        console.log("statusUpdate()");
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].getStatus() == enum_1.PlayerStatus.Attacked) {
                console.log("Player" + this.players[i].getId() + "[" + enum_1.PlayerType[this.players[i].getType()] + "] was killed.");
                this.players[i].killed();
            }
        }
    };
    GameMaster.prototype.checkGameOver = function () {
        var wolves = 0;
        var alives = 0;
        var result = enum_1.GameStatus.Not_End;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].getStatus() != enum_1.PlayerStatus.Dead) {
                alives++;
                if (this.players[i].getType() == enum_1.PlayerType.NormalWolf) {
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
