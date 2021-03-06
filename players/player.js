"use strict";
var enum_1 = require("../enum");
//import {log_output_settings,player_queue_list} from "./../special_charactors"
//var count = 0;
var silent = true;
var Player = (function () {
    function Player(type) {
        this.status = enum_1.PlayerStatus.Healthy;
        this.type = type;
        this.whitelist = [];
        this.partner = -1;
        //console.log("constructor" + PlayerType[this.type])
    }
    Player.prototype.getId = function () {
        return this.id;
    };
    Player.prototype.getType = function () {
        return this.type;
    };
    Player.prototype.getStatus = function () {
        return this.status;
    };
    Player.prototype.attacked = function () {
        this.setStatus(enum_1.PlayerStatus.Attacked);
    };
    Player.prototype.killed = function () {
        this.setStatus(enum_1.PlayerStatus.Dead);
    };
    Player.prototype.cured = function () {
        if (this.status == enum_1.PlayerStatus.Attacked) {
            this.setStatus(enum_1.PlayerStatus.Healthy);
        }
    };
    Player.prototype.setStatus = function (status) {
        this.status = status;
    };
    Player.prototype.action = function (players, lastVoteResult) {
    };
    Player.prototype.accuse = function (players) {
        var target;
        for (var i = 0; i < players.length; i++) {
            if (this.whitelist[i] == false) {
                this.say("accuse", i);
                return i;
            }
        }
        while (true) {
            target = this.pickTarget(players);
            if (target != this.id) {
                this.say("accuse", target);
                return target;
            }
        }
    };
    Player.prototype.vote = function (accuseResult, players) {
        var target;
        for (var i = 0; i < accuseResult.length; i++) {
            target = accuseResult[i][0];
            if (this.whitelist[target] != true && players[target].getStatus() != enum_1.PlayerStatus.Dead) {
                this.say("vote", target);
                return target;
            }
        }
    };
    Player.prototype.pickTarget = function (players) {
        var target;
        while (true) {
            target = Math.floor(Math.random() * players.length);
            if (players[target].getStatus() != enum_1.PlayerStatus.Dead) {
                return target;
            }
        }
    };
    Player.prototype.setPartner = function (target) {
        this.partner = target;
    };
    Player.prototype.say = function (act, target) {
        if (silent != true) {
            var message = this.getId() + ":" + enum_1.PlayerType[this.type] + " " + act + " player" + target;
            console.log(message);
        }
    };
    Player.prototype.clearWhitelist = function (length) {
        //console.log(this.id + "clearWhitelist()")
        for (var i = 0; i < length; i++) {
            this.whitelist[i] = undefined;
        }
        this.whitelist[this.id] = true;
    };
    Player.prototype.setId = function (id) {
        this.id = id;
    };
    return Player;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Player;
