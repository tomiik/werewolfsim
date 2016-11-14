declare function require(x: string): any;
const readlineSync = require('readline-sync');

import GameMaster from "./gameMaster"
import {PlayerType, PlayerStatus, GameStatus} from "./enum"

var no_of_wolves = readlineSync.question("Please input the number of wolves. >");
var no_of_villagers = readlineSync.question("Please input the number of villagers. >");
var games = readlineSync.question("Please input the number of games. >");
no_of_wolves = parseInt(no_of_wolves);
no_of_villagers = parseInt(no_of_villagers);
games = parseInt(games);

var winner: GameStatus;
var gamemaster:GameMaster;
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

console.log("wolves:" + wolves);
console.log("villagers:" + villagers);
