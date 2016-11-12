"use strict";
var villager_1 = require("./players/villager");
var wolf_1 = require("./players/wolf");
var log_output_settings = {
    "log_Others": false,
    "log_CheckStatus": true,
    "log_Accuse": false,
    "log_Vote": false,
    "log_actions": true,
};
exports.log_output_settings = log_output_settings;
var player_queue_list = [
    new villager_1.Doctor(),
    new villager_1.Cop(),
    new villager_1.Diseased(),
    new villager_1.Vigilante(),
    new villager_1.Witch(),
    new wolf_1.Rogue(),
    new villager_1.ToughGuy(),
    new villager_1.Mason(),
    new villager_1.Mason(),
    new villager_1.Cupid(),
];
exports.player_queue_list = player_queue_list;
