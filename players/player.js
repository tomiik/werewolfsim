"use strict";
var enum_1 = require("../enum");
var count = 0;
var Player = (function () {
    function Player(type) {
        this.status = enum_1.PlayerStatus.Healthy;
        this.type = type;
        this.id = count;
        this.whitelist = [];
        count++;
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
        this.status = enum_1.PlayerStatus.Attacked;
    };
    Player.prototype.killed = function () {
        this.status = enum_1.PlayerStatus.Dead;
    };
    Player.prototype.cured = function () {
        if (this.status == enum_1.PlayerStatus.Attacked) {
            this.status = enum_1.PlayerStatus.Healthy;
        }
    };
    Player.prototype.action = function (players) {
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
    Player.prototype.say = function (act, target) {
        console.log(this.getId() + ":" + enum_1.PlayerType[this.type] + " " + act + " player" + target);
    };
    Player.prototype.clearWhitelist = function (length) {
        //console.log(this.id + "clearWhitelist()")
        for (var i = 0; i < length; i++) {
            this.whitelist[i] = undefined;
        }
    };
    return Player;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Player;
