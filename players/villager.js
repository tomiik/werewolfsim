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
    function Doctor(playerType) {
        if (playerType === void 0) { playerType = enum_1.PlayerType.Doctor; }
        return _super.call(this, playerType) || this;
    }
    Doctor.prototype.action = function (players, lastVoteResult) {
        var target = this.pickTarget(players);
        this.cure(players, target);
    };
    Doctor.prototype.cure = function (players, target) {
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
var Witch = (function (_super) {
    __extends(Witch, _super);
    function Witch() {
        var _this = _super.call(this, enum_1.PlayerType.Witch) || this;
        _this.poison = 1;
        _this.potion = 1;
        return _this;
    }
    Witch.prototype.action = function (players, lastVoteResult) {
        var dice = Math.floor(Math.random() * 6);
        if (dice == 1) {
            if (this.poison > 0) {
                for (var i = 1; i < lastVoteResult.length; i++) {
                    if (lastVoteResult[i][0].getStatus != enum_1.PlayerStatus.Dead) {
                        this.usePoison(players, i);
                        return;
                    }
                }
            }
        }
        else if (dice == 2) {
            if (this.potion > 0) {
                for (var i = lastVoteResult.length - 1; i > 0; i--) {
                    if (lastVoteResult[i][0].getStatus != enum_1.PlayerStatus.Dead) {
                        this.usePotion(players, i);
                        return;
                    }
                }
            }
        }
    };
    Witch.prototype.usePoison = function (players, target) {
        players[target].attacked();
        this.say("attacked", target);
    };
    Witch.prototype.usePotion = function (players, target) {
        this.cure(players, target);
    };
    return Witch;
}(Doctor));
exports.Witch = Witch;
var ToughGuy = (function (_super) {
    __extends(ToughGuy, _super);
    function ToughGuy() {
        var _this = _super.call(this, enum_1.PlayerType.ToughGuy) || this;
        _this.energy = 1;
        return _this;
    }
    ToughGuy.prototype.action = function () {
        if (this.getStatus() == enum_1.PlayerStatus.Dying) {
            if (this.energy <= 0) {
                this.setStatus(enum_1.PlayerStatus.Attacked);
            }
            this.energy--;
        }
    };
    ToughGuy.prototype.attacked = function () {
        this.setStatus(enum_1.PlayerStatus.Dying);
    };
    return ToughGuy;
}(Villager));
exports.ToughGuy = ToughGuy;
var Cupid = (function (_super) {
    __extends(Cupid, _super);
    function Cupid() {
        var _this = _super.call(this, enum_1.PlayerType.Cupid) || this;
        _this.madeCouple = false;
        return _this;
    }
    Cupid.prototype.action = function (players) {
        if (this.madeCouple == false) {
            this.makeCouple(players);
            this.madeCouple = true;
        }
    };
    Cupid.prototype.makeCouple = function (players) {
        while (true) {
            var target1 = this.pickTarget(players);
            var target2 = this.pickTarget(players);
            console.log("cupid1:" + target1);
            console.log("cupid2:" + target2);
            if (target1 != target2 && target1 != this.getId() && target2 != this.getId()) {
                players[target1].setPartner(target2);
                players[target2].setPartner(target1);
                return;
            }
        }
    };
    return Cupid;
}(Villager));
exports.Cupid = Cupid;
