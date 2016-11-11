import {PlayerType, PlayerStatus} from "../enum"
var count = 0;
const silent = true;

export default class Player {
  private status: PlayerStatus;
  private type: PlayerType;
  private id: number;
  public whitelist;
  constructor(type){
    this.status = PlayerStatus.Healthy;
    this.type = type;
    this.id = count;
    this.whitelist = [];
    count++;
  }
  getId(){
    return this.id;
  }
  getType(){
    return this.type;
  }
  getStatus(){
    return this.status;
  }
  attacked(){
    this.status = PlayerStatus.Attacked;
  }
  killed(){
    this.status = PlayerStatus.Dead;
  }
  cured(){
    if(this.status == PlayerStatus.Attacked){
      this.status = PlayerStatus.Healthy;
    }
  }
  action(players){

  }
  accuse(players){
    var target;
    for(let i = 0; i < players.length; i++){
      if(this.whitelist[i] == false){
        this.say("accuse", i);
        return i;
      }
    }
    while(true){
      target = this.pickTarget(players);
      if(target != this.id){
        this.say("accuse", target);
        return target;
      }
    }
  }
  vote(accuseResult, players){
    var target;
    for(let i = 0; i < accuseResult.length; i++){
      target = accuseResult[i][0];
      if(this.whitelist[target] != true && players[target].getStatus() != PlayerStatus.Dead){
        this.say("vote", target);
        return target
      }
    }
  }
  pickTarget(players){
    var target;
    while(true){
      target = Math.floor(Math.random() * players.length)
      if(players[target].getStatus() != PlayerStatus.Dead){
        return target;
      }
    }
  }
  say(act,target){
    if(silent != true){
      var message = this.getId() + ":" + PlayerType[this.type] + " " + act + " player" + target
      console.log(message);
    }
  }
  clearWhitelist(length){
    //console.log(this.id + "clearWhitelist()")
    for(let i = 0; i < length; i++){
      this.whitelist[i] = undefined;
    }
  }
}
