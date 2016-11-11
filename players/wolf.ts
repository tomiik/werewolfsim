import {PlayerType, PlayerStatus} from "../enum"
import Player from "./player"

export default class Wolf extends Player{
  leader: boolean;
  constructor(type){
    super(type)
    this.leader = false;
  }
  setLeader(){
    this.leader = true;
  }
  kill(players){
    while(true){
      var target = this.pickTarget(players);

      if(this.whitelist[target] != true){
          players[target].attacked();
          this.say("attack", target)
          return true;
      }
    }
  }
  action(players){
  }
}

class NormalWolf extends Wolf{
  constructor(){
    super(PlayerType.NormalWolf)
  }
  identifyWolves(players){
    for(let i = 0; i < players.length; i++){
      if(players[i].getType() == PlayerType.NormalWolf){
        this.whitelist[i] = true;
      }
    }
  }
  action(players){
    if(this.leader == true){
      this.kill(players);
    }
  }
}

class Rogue extends Wolf{
  constructor(){
    super(PlayerType.Rogue);
  }
  action(players){
    this.kill(players);
  }

}
export {NormalWolf, Rogue}
