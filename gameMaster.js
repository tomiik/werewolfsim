"use strict";
var enum_1 = require("./enum");
var villager_1 = require("./players/villager");
var wolf_1 = require("./players/wolf");
var GameMaster = (function () {
    function GameMaster() {
        this.lastVoteResult = [];
        this.players = [];
    }
    GameMaster.prototype.play = function () {
        var lastVoteResult = [];
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
        for (var i = 0; i < this.players.length; i++) {
            console.log(this.players[i].getId() + ":" + enum_1.PlayerType[this.players[i].getType()] + "\t: " + enum_1.PlayerStatus[this.players[i].getStatus()]);
        }
        console.log("----------------------------------------------");
    };
    GameMaster.prototype.createPlayers = function (no_of_wolves, no_of_villagers) {
        var no_of_players = no_of_wolves + no_of_villagers;
        for (var i = 0; i < no_of_wolves; i++) {
            this.players.push(new wolf_1.NormalWolf);
        }
        this.players.push(new villager_1.Doctor);
        this.players.push(new villager_1.Cop);
        this.players.push(new villager_1.NormalVillager);
        this.players.push(new villager_1.NormalVillager);
        this.players.push(new villager_1.NormalVillager);
        this.players.push(new villager_1.NormalVillager);
        this.players.push(new villager_1.NormalVillager);
        this.players.push(new villager_1.NormalVillager);
        this.players.push(new villager_1.NormalVillager);
        this.players.push(new villager_1.NormalVillager);
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].clearWhitelist(no_of_players);
            if (this.players[i].getType() == enum_1.PlayerType.NormalWolf) {
                this.players[i].identifyWolves(this.players);
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
        console.log("--night start");
        //wolf
        this.selectWolfLeader();
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].getStatus() != enum_1.PlayerStatus.Dead) {
                this.players[i].action(this.players);
            }
        }
        console.log("--night end");
        this.statusUpdate();
    };
    GameMaster.prototype.dayEvents = function () {
        var accuseResult = this.accuse();
        console.log(accuseResult);
        var voteResult = this.vote(accuseResult);
        //console.log(voteResult);
        return voteResult;
    };
    GameMaster.prototype.accuse = function () {
        console.log("accuse()");
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
        console.log("vote()");
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
        console.log("player" + this.players[votedScore[0][0]].getId() + "[" + this.players[votedScore[0][0]].getType() + "] was executed.");
        this.players[votedScore[0][0]].killed();
        return votedScore;
    };
    GameMaster.prototype.statusUpdate = function () {
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
