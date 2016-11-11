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
    Doctor.prototype.action = function (players) {
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