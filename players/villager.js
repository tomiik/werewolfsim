"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var enum_1 = require("../enum");
var player_1 = require("./player");
var Villager = (function (_super) {
    __extends(Villager, _super);
    function Villager(type) {
        return _super.call(this, type) || this;
    }
    return Villager;
}(player_1.default));
var NormalVillager = (function (_super) {
    __extends(NormalVillager, _super);
    function NormalVillager() {
        return _super.call(this, enum_1.PlayerType.NormalVillager) || this;
    }
    return NormalVillager;
}(Villager));
exports.NormalVillager = NormalVillager;
var Doctor = (function (_super) {
    __extends(Doctor, _super);
    function Doctor() {
        return _super.call(this, enum_1.PlayerType.Doctor) || this;
    }
    Doctor.prototype.action = function (players, lastVoteResult) {
        this.cure(players);
    };
    Doctor.prototype.cure = function (players) {
        var target = this.pickTarget(players);
        players[target].cured();
        this.say("cure", target);
    };
    return Doctor;
}(Villager));
exports.Doctor = Doctor;
var Cop = (function (_super) {
    __extends(Cop, _super);
    function Cop() {
        return _super.call(this, enum_1.PlayerType.Cop) || this;
    }
    Cop.prototype.action = function (players, lastVoteResult) {
        this.identify(players);
        //console.log(PlayerType[this.getType()] + " whitelist:" + this.whitelist)
        this.say("whitelist", this.whitelist);
    };
    Cop.prototype.identify = function (players) {
        var count = 0;
        while (true) {
            var target = this.pickTarget(players);
            //console.log(target + ":" + this.whitelist[target]);
            if (this.whitelist[target] == undefined) {
                if (players[target].getType() == enum_1.PlayerType.NormalWolf) {
                    this.whitelist[target] = false;
                }
                else {
                    this.whitelist[target] = true;
                }
                this.say("identify", target + "> " + enum_1.PlayerType[players[target].getType()]);
                return;
            }
            if (count > players.length) {
                return;
            }
            count++;
        }
    };
    return Cop;
}(Villager));
exports.Cop = Cop;
var Diseased = (function (_super) {
    __extends(Diseased, _super);
    function Diseased() {
        return _super.call(this, enum_1.PlayerType.Diseased) || this;
    }
    Diseased.prototype.attacked = function () {
    };
    return Diseased;
}(Villager));
exports.Diseased = Diseased;
var Vigilante = (function (_super) {
    __extends(Vigilante, _super);
    function Vigilante() {
        return _super.call(this, enum_1.PlayerType.Vigilante) || this;
    }
    Vigilante.prototype.action = function (players, lastVoteResult) {
        this.kill(players, lastVoteResult);
    };
    Vigilante.prototype.kill = function (players, lastVoteResult) {
        if (lastVoteResult.length > 2) {
            if (lastVoteResult[1][1] == lastVoteResult[0][1]) {
                players[lastVoteResult[1][0]].attacked();
                this.say("attack", lastVoteResult[1][0]);
            }
        }
    };
    return Vigilante;
}(Villager));
exports.Vigilante = Vigilante;
