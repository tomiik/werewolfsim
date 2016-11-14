import {NormalVillager,Doctor, Cop, Diseased, Vigilante, Witch, ToughGuy, Cupid, LittleGirl, Mason} from "./players/villager"
import {NormalWolf, Rogue} from "./players/wolf"

var log_output_settings = {
  "log_Others": false,
  "log_CheckStatus": false,
  "log_Accuse": false,
  "log_Vote": false,
  "log_actions": false,
}

//Villagers are from this list. After joined all character from it, ramaining villagers are normal villagers.
/*
var player_queue_list = [
  new Doctor(),
  new Cop(),
  new Diseased(),
  new Vigilante(),
  new Witch(),
  new Rogue(),
  new ToughGuy(),
  new Mason(),
  new Mason(),
  new Cupid(),
  new LittleGirl(),
];
*/
export{log_output_settings}
