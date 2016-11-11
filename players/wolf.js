"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var enum_1 = require("../enum");
var player_1 = require("./player");
var Wolf = (function (_super) {
    __extends(Wolf, _super);
    function Wolf(type) {
        var _this = _super.call(this, type) || this;
        _this.leader = false;
        return _this;
    }
    Wolf.prototype.setLeader = function () {
        this.leader = true;
    };
    Wolf.prototype.kill = function (players) {
        while (true) {
            var target = this.pickTarget(players);
            if (this.whitelist[target] != true) {
                players[target].attacked();
                this.say("attack", target);
                return true;
            }
        }
    };
    Wolf.prototype.action = function (players) {
    };
    return Wolf;
}(player_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Wolf;
var NormalWolf = (function (_super) {
    __extends(NormalWolf, _super);
    function NormalWolf() {
        return _super.call(this, enum_1.PlayerType.NormalWolf) || this;
    }
    NormalWolf.prototype.identifyWolves = function (players) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].getType() == enum_1.PlayerType.NormalWolf) {
                this.whitelist[i] = true;
            }
        }
    };
    NormalWolf.prototype.action = function (players) {
        if (this.leader == true) {
            this.kill(players);
        }
    };
    return NormalWolf;
}(Wolf));
exports.NormalWolf = NormalWolf;
var Rogue = (function (_super) {
    __extends(Rogue, _super);
    function Rogue() {
        return _super.call(this, enum_1.PlayerType.Rogue) || this;
    }
    Rogue.prototype.action = function (players) {
        this.kill(players);
    };
    return Rogue;
}(Wolf));
exports.Rogue = Rogue;
