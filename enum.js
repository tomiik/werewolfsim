"use strict";
var PlayerType;
(function (PlayerType) {
    PlayerType[PlayerType["NormalWolf"] = 1] = "NormalWolf";
    PlayerType[PlayerType["Rogue"] = 2] = "Rogue";
    PlayerType[PlayerType["NormalVillager"] = 3] = "NormalVillager";
    PlayerType[PlayerType["Doctor"] = 4] = "Doctor";
    PlayerType[PlayerType["Witch"] = 5] = "Witch";
    PlayerType[PlayerType["LittleGirl"] = 6] = "LittleGirl";
    PlayerType[PlayerType["Cop"] = 7] = "Cop";
    PlayerType[PlayerType["Diseased"] = 8] = "Diseased";
    PlayerType[PlayerType["Vigilante"] = 9] = "Vigilante";
    PlayerType[PlayerType["ToughGuy"] = 10] = "ToughGuy";
    PlayerType[PlayerType["Cupid"] = 11] = "Cupid";
})(PlayerType || (PlayerType = {}));
exports.PlayerType = PlayerType;
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["Healthy"] = 1] = "Healthy";
    PlayerStatus[PlayerStatus["Attacked"] = 2] = "Attacked";
    PlayerStatus[PlayerStatus["Dying"] = 3] = "Dying";
    PlayerStatus[PlayerStatus["Dead"] = 4] = "Dead";
})(PlayerStatus || (PlayerStatus = {}));
exports.PlayerStatus = PlayerStatus;
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["End_Wolves_Won"] = 1] = "End_Wolves_Won";
    GameStatus[GameStatus["End_Villagers_Won"] = 2] = "End_Villagers_Won";
    //End_Draw,
    GameStatus[GameStatus["Not_End"] = 3] = "Not_End";
})(GameStatus || (GameStatus = {}));
exports.GameStatus = GameStatus;
