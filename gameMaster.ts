import {PlayerType, PlayerStatus, GameStatus} from "./enum"
import {NormalVillager,Doctor} from "./players/villager"
import {NormalWolf} from "./players/wolf"

var players = [];

export default class GameMaster {
  constructor(){

  }
  play(){
    var gamestatus = GameStatus.Not_End;
    for(let i = 0; i < 10; i++){
      console.log("============== day " + i + "==============")
      this.nightEvents();
      this.checkPlayers();
      gamestatus = this.checkGameOver();
      if(gamestatus == GameStatus.End_Wolves_Won){
        console.log("~~~~~~~~~~~~~~ Wolves Won ~~~~~~~~~~~~~~~~");
        return gamestatus;
      }
      else if(gamestatus == GameStatus.End_Villagers_Won){
        console.log("~~~~~~~~~~~~~~ Villagers Won ~~~~~~~~~~~~~~~~");
        return gamestatus;
      }
      this.dayEvents();
      this.checkPlayers();
      gamestatus = this.checkGameOver();
      if(gamestatus == GameStatus.End_Wolves_Won){
        console.log("~~~~~~~~~~~~~~ Wolves Won ~~~~~~~~~~~~~~~~");
        return gamestatus;
      }
      else if(gamestatus == GameStatus.End_Villagers_Won){
        console.log("~~~~~~~~~~~~~~ Villagers Won ~~~~~~~~~~~~~~~~");
        return gamestatus;
      }
    }

  }
  checkPlayers(){
    console.log("----------------------------------------------")
    for(let i = 0; i < players.length; i++){
      console.log(players[i].getId() +":" + PlayerType[players[i].getType()] + "\t: " + PlayerStatus[players[i].getStatus()]);
    }
    console.log("----------------------------------------------")
  }
  createPlayers(no_of_wolves, no_of_villagers){
    var no_of_players = no_of_wolves + no_of_villagers;
    for(var i = 0; i < no_of_wolves; i++){
      players.push(new NormalWolf);
    }
    players.push(new Doctor);
    players.push(new NormalVillager);
    players.push(new NormalVillager);
    players.push(new NormalVillager);
    players.push(new NormalVillager);
    players.push(new NormalVillager);
    players.push(new NormalVillager);
    players.push(new NormalVillager);
    players.push(new NormalVillager);
    players.push(new NormalVillager);

    for(var i = 0; i < players.length; i++){
      players[i].clearWhitelist(no_of_players);
      if(players[i].getType() == PlayerType.NormalWolf){
        players[i].identifyWolves(players);
      }
    }
  }
  selectWolfLeader(){
    for(let i = 0; i < players.length; i++){
      if(players[i].type == PlayerType.NormalWolf && players[i].getStatus() == PlayerStatus.Healthy){
        players[i].setLeader();
        return true;
      }
    }
    return false;
  }
  nightEvents(){
    console.log("--night start")
    //wolf
    this.selectWolfLeader();
    for(let i = 0; i < players.length; i++){
      players[i].action(players);
    }
    console.log("--night end");
    this.statusUpdate();
  }
  dayEvents(){
    var accuseResult = this.accuse();
    console.log(accuseResult);
    var voteResult = this.vote(accuseResult);
    console.log(voteResult);
  }
  accuse(){
    console.log("accuse()");
    var accuse;
    var accusedScore = [];
    //initialize accuse Score
    for(let i = 0; i < players.length; i++){
      accusedScore[i] = [i,0];
    }
    //accuse
    for(let i = 0; i < players.length; i++){
      accuse = players[i].accuse(players);
      accusedScore[accuse] = [accuse,accusedScore[accuse][1] + 1];
    }
    accusedScore.sort(function(a,b){return b[1] - a[1]})
    return accusedScore;
  }
  vote(accusedResult){
    console.log("vote()");
    var vote;
    var votedScore = [];
    //initialize accuse Score
    for(let i = 0; i < players.length; i++){
      votedScore[i] = [i,0];
    }

    //vote
    for(let i = 0; i < players.length; i++){
      vote = players[i].vote(accusedResult,players);
      votedScore[vote] = [vote,votedScore[vote][1] + 1];
    }
    votedScore.sort(function(a,b){return b[1] - a[1]})

    console.log("player" + players[votedScore[0][0]].getId() + "[" + players[votedScore[0][0]].getType() + "] was executed.");
    players[votedScore[0][0]].killed();

    return votedScore;
  }
  statusUpdate(){
    for(let i = 0; i < players.length; i++){
      if(players[i].getStatus() == PlayerStatus.Attacked){
        console.log("Player" + players[i].getId() + "[" + PlayerType[players[i].getType()] + "] was killed." )
        players[i].killed();
      }
    }
  }
  checkGameOver(){
    var wolves = 0;
    var alives = 0;
    var result = GameStatus.Not_End;
    for(let i = 0; i < players.length; i++){
      if(players[i].getStatus() != PlayerStatus.Dead)
      {
        alives++;
        if(players[i].getType() == PlayerType.NormalWolf){
          wolves++;
        }
      }
    }
    console.log("Alives:" + alives + " Wloves:" + wolves + " Villagers:" + (alives - wolves));
    if(wolves >= (alives - wolves)){
      result =  GameStatus.End_Wolves_Won;
    }
    else if(wolves == 0){
      result = GameStatus.End_Villagers_Won;
    }
    return result;
  };
}
