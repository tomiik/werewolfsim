"use strict";
var PlayerType;
(function (PlayerType) {
    PlayerType[PlayerType["NormalWolf"] = 1] = "NormalWolf";
    PlayerType[PlayerType["Rogue"] = 2] = "Rogue";
    PlayerType[PlayerType["NormalVillager"] = 3] = "NormalVillager";
    PlayerType[PlayerType["Doctor"] = 4] = "Doctor";
    PlayerType[PlayerType["Witch"] = 5] = "Witch";
    PlayerType[PlayerType["LittleGirl"] = 6] = "LittleGirl";
})(PlayerType || (PlayerType = {}));
exports.PlayerType = PlayerType;
