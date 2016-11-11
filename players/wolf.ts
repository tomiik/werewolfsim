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
  action(players){
    if(this.leader == true){
      while(true){
        var target = this.pickTarget(players);

        if( players[target].type != PlayerType.NormalWolf &&
            players[target].type != PlayerType.Rogue &&
            players[target].getStatus != PlayerStatus.Dead){
            players[target].attacked();
            this.say("attack", target)
            return true;
        }
      }
    }
    return false;
  }
}

class NormalWolf extends Wolf{
  constructor(){
    super(PlayerType.NormalWolf)
  }
  accuse(players){
    var target;
    while(true){
      target = this.pickTarget(players);
      if(players[target].getType != PlayerType.NormalWolf){
        return target;
      }
    }
  }
  identifyWolves(players){
    for(let i = 0; i < players.length; i++){
      if(players[i].getType() == PlayerType.NormalWolf){
        this.whitelist[i] = true;
      }
    }
  }

}

export {NormalWolf}
