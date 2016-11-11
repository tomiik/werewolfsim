import GameMaster from "./gameMaster"
const no_of_wolves = 2;
const no_of_villagers = 5;
var gamemaster = new GameMaster();

gamemaster.createPlayers(no_of_wolves,no_of_villagers);
gamemaster.play();
