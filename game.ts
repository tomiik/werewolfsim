import GameMaster from "./gameMaster"
import {PlayerType, PlayerStatus, GameStatus} from "./enum"

const no_of_wolves = 4;
const no_of_villagers = 14;

var winner: GameStatus;
var gamemaster:GameMaster;
var wolves = 0;
var villagers = 0;
var games = 10;

for(let i = 0; i < games; i++){
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
