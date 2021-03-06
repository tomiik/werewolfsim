"use strict";
var enum_1 = require("./enum");
var villager_1 = require("./players/villager");
var wolf_1 = require("./players/wolf");
var settings_1 = require("./settings");
var log_CheckStatus = settings_1.log_output_settings.log_CheckStatus;
var log_Accuse = settings_1.log_output_settings.log_Accuse;
var log_Vote = settings_1.log_output_settings.log_Vote;
var log_Others = settings_1.log_output_settings.log_Others;
var count = 0;
var GameMaster = (function () {
    function GameMaster(no_of_wolves, no_of_villagers) {
        this.lastVoteResult = [];
        this.players = [];
        this.players_queue = [];
        this.night = true;
        this.day = 1;
        this.createPlayers(no_of_wolves, no_of_villagers);
    }
    GameMaster.prototype.play = function () {
        var lastVoteResult = [];
        var gamestatus = enum_1.GameStatus.Not_End;
        while (gamestatus == enum_1.GameStatus.Not_End) {
            this.log("");
            this.log("============== day " + this.day + "==============");
            if (this.night == true) {
                this.nightEvents();
                this.night = false;
            }
            else {
                this.dayEvents();
                this.night = true;
                this.day++;
            }
            this.checkPlayers();
            gamestatus = this.checkGameOver();
        }
        return gamestatus;
    };
    GameMaster.prototype.checkPlayers = function () {
        if (log_CheckStatus == true) {
            this.log("----------------------------------------------");
            for (var i = 0; i < this.players.length; i++) {
                //console.log(this.players[i].getId() +":" + PlayerType[this.players[i].getType()] + "\t: " + PlayerStatus[this.players[i].getStatus()]);
                this.log(this.players[i].getId() + ":" + enum_1.PlayerStatus[this.players[i].getStatus()] + "   \t:" + enum_1.PlayerType[this.players[i].getType()]);
            }
            this.log("----------------------------------------------");
        }
    };
    GameMaster.prototype.createPlayers = function (no_of_wolves, no_of_villagers) {
        var no_of_players = no_of_wolves + no_of_villagers;
        this.createWolves(no_of_wolves);
        //this.players_queue = [new Doctor(), new Cop(), new Diseased(), new Vigilante(), new Witch(), new Rogue(), new ToughGuy(),new Mason(), new Mason(), new Mason, new Cupid(), new LittleGirl()];
        this.createVillagers(no_of_villagers);
        this.initializePlayers();
    };
    GameMaster.prototype.initializePlayers = function () {
        this.giveIdToPlayers();
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].clearWhitelist(this.players.length);
            if (this.players[i].getType() == enum_1.PlayerType.NormalWolf) {
                this.players[i].identifyWolves(this.players);
            }
            if (this.players[i].getType() == enum_1.PlayerType.Mason) {
                this.players[i].identifyMasons(this.players);
            }
        }
    };
    GameMaster.prototype.createWolves = function (num) {
        for (var i = 0; i < num; i++) {
            this.players.push(new wolf_1.NormalWolf);
        }
    };
    GameMaster.prototype.createVillagers = function (num) {
        this.copySpecialCharactersFromDictionary();
        for (var i = 0; i < num; i++) {
            if (this.players_queue.length > 0) {
                this.players.push(this.players_queue.shift());
            }
            else {
                this.players.push(new villager_1.NormalVillager);
            }
        }
    };
    GameMaster.prototype.copySpecialCharactersFromDictionary = function () {
        var players_queue_list = [new villager_1.Doctor(), new villager_1.Cop(), new villager_1.Diseased(), new villager_1.Vigilante(), new villager_1.Witch(), new wolf_1.Rogue(), new villager_1.ToughGuy(), new villager_1.Mason(), new villager_1.Mason(), new villager_1.Cupid(), new villager_1.LittleGirl()];
        for (var i = 0; i < players_queue_list.length; i++) {
            this.players_queue.push(players_queue_list[i]);
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
        this.log("------------- Night -------------");
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
        this.log("-------------  Day  -------------");
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
            this.log("accuse()");
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
            this.log("vote()");
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
        var target = votedScore[0][0];
        this.log("player" + this.players[target].getId() + "[" + enum_1.PlayerType[this.players[target].getType()] + "] was executed.");
        this.players[target].killed();
        if (this.players[target].partner > 0) {
            this.log("Player" + this.players[this.players[target].partner].getId() + "[" + enum_1.PlayerType[this.players[this.players[target].partner].getType()] + "] was dead.");
            this.players[this.players[target].partner].killed();
        }
        return votedScore;
    };
    GameMaster.prototype.statusUpdate = function () {
        this.log("statusUpdate()");
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].getStatus() == enum_1.PlayerStatus.Attacked) {
                this.log("Player" + this.players[i].getId() + "[" + enum_1.PlayerType[this.players[i].getType()] + "] was killed.");
                this.players[i].killed();
                if (this.players[i].partner >= 0) {
                    this.log("Player" + this.players[this.players[i].partner].getId() + "[" + enum_1.PlayerType[this.players[this.players[i].partner].getType()] + "] was dead.");
                    this.players[this.players[i].partner].killed();
                }
            }
        }
    };
    GameMaster.prototype.giveIdToPlayers = function () {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].setId(i);
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
        this.log("Alives:" + alives + " Wloves:" + wolves + " Villagers:" + (alives - wolves));
        if (wolves >= (alives - wolves)) {
            result = enum_1.GameStatus.End_Wolves_Won;
            this.log("~~~~~~~~~~~~~~ Wolves Won ~~~~~~~~~~~~~~~~");
        }
        else if (wolves == 0) {
            result = enum_1.GameStatus.End_Villagers_Won;
            this.log("~~~~~~~~~~~~~~ Villagers Won ~~~~~~~~~~~~~~~~");
        }
        return result;
    };
    ;
    GameMaster.prototype.log = function (string) {
        if (log_Others == true) {
            console.log(string);
        }
    };
    return GameMaster;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameMaster;
