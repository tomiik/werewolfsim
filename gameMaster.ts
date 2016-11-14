import {PlayerType, PlayerStatus, GameStatus} from "./enum"
import {NormalVillager,Doctor, Cop, Diseased, Vigilante, Witch, ToughGuy, Cupid, LittleGirl, Mason} from "./players/villager"
import {NormalWolf, Rogue} from "./players/wolf"
import {log_output_settings} from "./settings"

var log_CheckStatus = log_output_settings.log_CheckStatus;
var log_Accuse = log_output_settings.log_Accuse;
var log_Vote = log_output_settings.log_Vote;
var log_Others = log_output_settings.log_Others;
var count = 0;

export default class GameMaster {
  lastVoteResult = [];
  players = [];
  players_queue = [];
  night:boolean;
  day:number;
  constructor(no_of_wolves, no_of_villagers){
    this.night = true;
    this.day = 1;
    this.createPlayers(no_of_wolves, no_of_villagers)
  }
  play(){
    var lastVoteResult = [];
    var gamestatus = GameStatus.Not_End;
    while(gamestatus == GameStatus.Not_End){
      this.log("");
      this.log("============== day " + this.day + "==============")
      if(this.night == true){
        this.nightEvents();
        this.night = false;
      }
      else {
        this.dayEvents();
        this.night = true;
        this.day++;
      }
      this.checkPlayers();
      gamestatus = this.checkGameOver();
    }
    return gamestatus;
  }
  checkPlayers(){
    if(log_CheckStatus == true){
      this.log("----------------------------------------------")
      for(let i = 0; i < this.players.length; i++){
        //console.log(this.players[i].getId() +":" + PlayerType[this.players[i].getType()] + "\t: " + PlayerStatus[this.players[i].getStatus()]);
        this.log(this.players[i].getId() +":" + PlayerStatus[this.players[i].getStatus()] + "   \t:" + PlayerType[this.players[i].getType()]);

      }
      this.log("----------------------------------------------")
    }
  }
  createPlayers(no_of_wolves, no_of_villagers){
    var no_of_players = no_of_wolves + no_of_villagers;

    this.createWolves(no_of_wolves);

    //this.players_queue = [new Doctor(), new Cop(), new Diseased(), new Vigilante(), new Witch(), new Rogue(), new ToughGuy(),new Mason(), new Mason(), new Mason, new Cupid(), new LittleGirl()];
    this.createVillagers(no_of_villagers);

    this.initializePlayers();
  }
  initializePlayers(){
    this.giveIdToPlayers();
    for(var i = 0; i < this.players.length; i++){
      this.players[i].clearWhitelist(this.players.length);
      if(this.players[i].getType() == PlayerType.NormalWolf){
        this.players[i].identifyWolves(this.players);
      }
      if(this.players[i].getType() == PlayerType.Mason){
        this.players[i].identifyMasons(this.players);
      }
    }
  }
  createWolves(num){
    for(let i = 0; i < num; i++){
      this.players.push(new NormalWolf);
    }
  }
  createVillagers(num){
    this.copySpecialCharactersFromDictionary();
    for(let i = 0; i < num; i++){
      if(this.players_queue.length > 0){
        this.players.push(this.players_queue.shift())
      }
      else{
        this.players.push(new NormalVillager);
      }
    }
  }
  copySpecialCharactersFromDictionary(){
    var players_queue_list = [new Doctor(), new Cop(), new Diseased(), new Vigilante(), new Witch(), new Rogue(), new ToughGuy(),new Mason(), new Mason(), new Cupid(), new LittleGirl()];

    for(let i = 0; i < players_queue_list.length; i++){
      this.players_queue.push(players_queue_list[i]);
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
    this.log("------------- Night -------------")
    //wolf
    this.selectWolfLeader();
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].getStatus() != PlayerStatus.Dead){
        this.players[i].action(this.players, this.lastVoteResult);
      }
    }
    this.statusUpdate();
  }
  dayEvents(){
    this.log("-------------  Day  -------------")
    var accuseResult = this.accuse();

    if(log_Accuse == true){console.log(accuseResult)}
    this.lastVoteResult = this.vote(accuseResult);
    if(log_Vote == true){console.log(this.lastVoteResult)}
  }
  accuse(){
    if(log_Accuse == true){
      this.log("accuse()");
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
      this.log("vote()");
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
    var target = votedScore[0][0];
    this.log("player" + this.players[target].getId() + "[" + PlayerType[this.players[target].getType()] + "] was executed.");
    this.players[target].killed();
    if(this.players[target].partner > 0){
      this.log("Player" + this.players[this.players[target].partner].getId() + "[" + PlayerType[this.players[this.players[target].partner].getType()] + "] was dead." )
      this.players[this.players[target].partner].killed();
    }
    return votedScore;
  }
  statusUpdate(){
    this.log("statusUpdate()")
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].getStatus() == PlayerStatus.Attacked){
        this.log("Player" + this.players[i].getId() + "[" + PlayerType[this.players[i].getType()] + "] was killed." )
        this.players[i].killed();
        if(this.players[i].partner >= 0){
          this.log("Player" + this.players[this.players[i].partner].getId() + "[" + PlayerType[this.players[this.players[i].partner].getType()] + "] was dead." )
          this.players[this.players[i].partner].killed();
        }
      }
    }
  }
  giveIdToPlayers(){
    for(let i = 0; i < this.players.length; i++){
      this.players[i].setId(i);
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
    this.log("Alives:" + alives + " Wloves:" + wolves + " Villagers:" + (alives - wolves));
    if(wolves >= (alives - wolves)){
      result =  GameStatus.End_Wolves_Won;
      this.log("~~~~~~~~~~~~~~ Wolves Won ~~~~~~~~~~~~~~~~");
    }
    else if(wolves == 0){
      result = GameStatus.End_Villagers_Won;
      this.log("~~~~~~~~~~~~~~ Villagers Won ~~~~~~~~~~~~~~~~");
    }
    return result;
  };
  log(string){
    if(log_Others == true){
      console.log(string);
    }
  }
}
