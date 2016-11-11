import {PlayerType, PlayerStatus, GameStatus} from "./enum"
import {NormalVillager,Doctor, Cop} from "./players/villager"
import {NormalWolf} from "./players/wolf"


export default class GameMaster {
  lastVoteResult = [];
  players = [];
  constructor(){

  }
  play(){
    var lastVoteResult = [];
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
    for(let i = 0; i < this.players.length; i++){
      console.log(this.players[i].getId() +":" + PlayerType[this.players[i].getType()] + "\t: " + PlayerStatus[this.players[i].getStatus()]);
    }
    console.log("----------------------------------------------")
  }
  createPlayers(no_of_wolves, no_of_villagers){
    var no_of_players = no_of_wolves + no_of_villagers;
    for(var i = 0; i < no_of_wolves; i++){
      this.players.push(new NormalWolf);
    }
    this.players.push(new Doctor);
    this.players.push(new Cop);
    this.players.push(new NormalVillager);
    this.players.push(new NormalVillager);
    this.players.push(new NormalVillager);
    this.players.push(new NormalVillager);
    this.players.push(new NormalVillager);
    this.players.push(new NormalVillager);
    this.players.push(new NormalVillager);
    this.players.push(new NormalVillager);

    for(var i = 0; i < this.players.length; i++){
      this.players[i].clearWhitelist(no_of_players);
      if(this.players[i].getType() == PlayerType.NormalWolf){
        this.players[i].identifyWolves(this.players);
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
    console.log("--night start")
    //wolf
    this.selectWolfLeader();
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].getStatus() != PlayerStatus.Dead){
        this.players[i].action(this.players);
      }
    }
    console.log("--night end");
    this.statusUpdate();
  }
  dayEvents(){
    var accuseResult = this.accuse();
    console.log(accuseResult);
    var voteResult = this.vote(accuseResult);
    //console.log(voteResult);
    return voteResult;
  }
  accuse(){
    console.log("accuse()");
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
    console.log("vote()");
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

    console.log("player" + this.players[votedScore[0][0]].getId() + "[" + this.players[votedScore[0][0]].getType() + "] was executed.");
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
