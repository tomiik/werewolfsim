declare function require(x: string): any;
const readlineSync = require('readline-sync');

import GameMaster from "./gameMaster"
import {PlayerType, PlayerStatus, GameStatus} from "./enum"

var no_of_players = readlineSync.question("Please input the number of players. >");;
var games = readlineSync.question("Please input the number of games. >");


var winner: GameStatus;
var gamemaster:GameMaster;
for(let j = Math.ceil(no_of_players/20); j < no_of_players/2; j++){
  var no_of_wolves = j
  var no_of_villagers = no_of_players - no_of_wolves;
  var wolves = 0;
  var villagers = 0;
  for(let i = 0; i < games; i++){
    gamemaster = new GameMaster(no_of_wolves,no_of_villagers);
    winner = gamemaster.play();
    if(winner == GameStatus.End_Wolves_Won){
      wolves++;
    }else if(winner == GameStatus.End_Villagers_Won){
      villagers++;
    }
  }
  console.log("wolves:" + no_of_wolves + " villagers:" + no_of_villagers + " -> wolves:" + Math.round(100*wolves/games) + "% / villagers:" + Math.round(100*villagers/games) + "%" );
  if(wolves > villagers){
    break;
  }
}
