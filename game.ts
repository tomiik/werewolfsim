import GameMaster from "./gameMaster"
import {PlayerType, PlayerStatus, GameStatus} from "./enum"

const no_of_wolves = 3;
const no_of_villagers = 10;

var winner: GameStatus;
var gamemaster:GameMaster;
var wolves = 0;
var villagers = 0;

for(let i = 0; i < 1; i++){
  gamemaster = new GameMaster(no_of_wolves,no_of_villagers);
  winner = gamemaster.play();
  if(winner == GameStatus.End_Wolves_Won){
    wolves++;
  }else if(winner == GameStatus.End_Villagers_Won){
    villagers++;
  }
}

console.log("wolves:" + wolves);
console.log("villagers:" + villagers);
