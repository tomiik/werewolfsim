import {PlayerType, PlayerStatus} from "../enum"
var count = 0;
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
    while(true){
      target = this.pickTarget(players);
      if(target != this.id){
        return target
      }
    }
  }
  vote(accuseResult, players){
    var target;
    for(let i = 0; i < accuseResult.length; i++){
      target = accuseResult[i][0];

      if(this.whitelist[target] != true && players[i].getStatus() != PlayerStatus.Dead){
        //console.log(this.id + ":vote:"+ target + "whitelist:" + this.whitelist[target]);
        return target
      }
    }
    while(true){

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
    console.log(PlayerType[this.type] + " " + act + " player" + target);
  }
  clearWhitelist(length){
    //console.log(this.id + "clearWhitelist()")
    for(let i = 0; i < length; i++){
      this.whitelist[i] = undefined;
    }
  }
}
