import {PlayerType, PlayerStatus, GameStatus} from "./enum"
import {NormalVillager,Doctor, Cop, Diseased} from "./players/villager"
import {NormalWolf} from "./players/wolf"

var log_CheckStatus = false;
var log_Accuse = false;
var log_Vote = false;

export default class GameMaster {
  lastVoteResult = [];
  players = [];
  players_queue = [];
  constructor(){

  }
  play(){
    var lastVoteResult = [];
    var gamestatus = GameStatus.Not_End;
    for(let i = 0; i < 10; i++){
      console.log();
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
    if(log_CheckStatus == true){
      console.log("----------------------------------------------")
      for(let i = 0; i < this.players.length; i++){
        console.log(this.players[i].getId() +":" + PlayerType[this.players[i].getType()] + "\t: " + PlayerStatus[this.players[i].getStatus()]);

      }
      console.log("----------------------------------------------")
    }
  }
  createPlayers(no_of_wolves, no_of_villagers){
    var no_of_players = no_of_wolves + no_of_villagers;

    this.createWolves(no_of_wolves);

    this.players_queue = [new Doctor(), new Cop(), new Diseased()];
    this.createVillagers(no_of_villagers);

    this.initializePlayers();
  }
  initializePlayers(){
    for(var i = 0; i < this.players.length; i++){
      this.players[i].clearWhitelist(this.players.length);
      if(this.players[i].getType() == PlayerType.NormalWolf){
        this.players[i].identifyWolves(this.players);
      }
    }
  }
  createWolves(num){
    for(let i = 0; i < num; i++){
      this.players.push(new NormalWolf);
    }

  }
  createVillagers(num){
    for(let i = 0; i < num; i++){
      if(this.players_queue.length > 0){
        this.players.push(this.players_queue.shift())
      }
      else{
        this.players.push(new NormalVillager);
      }
    }
  }
  selectWolfLeader(){
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].type == PlayerType.NormalWolf && this.players[i].getStatus() == PlayerStatus.Healthy){
        this.players[i].setLeader();
        return true;
      }
    }
    return false;
  }
  nightEvents(){
    console.log("------------- Night -------------")
    //wolf
    this.selectWolfLeader();
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].getStatus() != PlayerStatus.Dead){
        this.players[i].action(this.players);
      }
    }
    this.statusUpdate();
  }
  dayEvents(){
    console.log("-------------  Day  -------------")
    var accuseResult = this.accuse();

    if(log_Accuse == true){console.log(accuseResult)}
    var voteResult = this.vote(accuseResult);
    if(log_Vote == true){console.log(voteResult)}

    return voteResult;
  }
  accuse(){
    if(log_Accuse == true){
      console.log("accuse()");
    }
    var accuse;
    var accusedScore = [];
    //initialize accuse Score
    for(let i = 0; i < this.players.length; i++){
      accusedScore[i] = [i,0];
    }
    //accuse
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].getStatus() != PlayerStatus.Dead ){
        accuse = this.players[i].accuse(this.players);
        accusedScore[accuse] = [accuse,accusedScore[accuse][1] + 1];
      }
    }
    accusedScore.sort(function(a,b){return b[1] - a[1]})
    return accusedScore;
  }
  vote(accusedResult){
    if(log_Vote == true){
      console.log("vote()");
    }
    var vote;
    var votedScore = [];
    //initialize accuse Score
    for(let i = 0; i < this.players.length; i++){
      votedScore[i] = [i,0];
    }

    //vote
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].getStatus() != PlayerStatus.Dead ){
        vote = this.players[i].vote(accusedResult, this.players);
        votedScore[vote] = [vote,votedScore[vote][1] + 1];
      }
    }
    votedScore.sort(function(a,b){return b[1] - a[1]})

    console.log("player" + this.players[votedScore[0][0]].getId() + "[" + PlayerType[this.players[votedScore[0][0]].getType()] + "] was executed.");
    this.players[votedScore[0][0]].killed();

    return votedScore;
  }
  statusUpdate(){
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].getStatus() == PlayerStatus.Attacked){
        console.log("Player" + this.players[i].getId() + "[" + PlayerType[this.players[i].getType()] + "] was killed." )
        this.players[i].killed();
      }
    }
  }
  checkGameOver(){
    var wolves = 0;
    var alives = 0;
    var result = GameStatus.Not_End;
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].getStatus() != PlayerStatus.Dead)
      {
        alives++;
        if(this.players[i].getType() == PlayerType.NormalWolf){
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
