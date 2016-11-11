import {PlayerType} from "../enum"
import Player from "./player"

class Villager extends Player{
  constructor(type){
    super(type)
  }
}

class NormalVillager extends Villager{
  constructor(){
    super(PlayerType.NormalVillager)
  }
}

class Doctor extends Villager{
  constructor(){
    super(PlayerType.Doctor);
  }
  action(players, lastVoteResult){
    this.cure(players);
  }
  cure(players){
    var target = this.pickTarget(players)
    players[target].cured();
    this.say("cure", target);
  }
}

class Cop extends Villager{
  constructor(){
    super(PlayerType.Cop);
  }
  action(players, lastVoteResult){
    this.identify(players);
    //console.log(PlayerType[this.getType()] + " whitelist:" + this.whitelist)
    this.say("whitelist", this.whitelist);
  }
  identify(players){
    var count = 0;
    while(true){
      var target = this.pickTarget(players);
      //console.log(target + ":" + this.whitelist[target]);
      if(this.whitelist[target] == undefined ){
        if(players[target].getType() == PlayerType.NormalWolf){
          this.whitelist[target] = false;
        }else{
          this.whitelist[target] = true;
        }
        this.say("identify", target + "> " + PlayerType[players[target].getType()])

        return;
      }
      if(count > players.length){
        return;
      }
      count++;
    }
  }
}

class Diseased extends Villager{
  constructor(){
    super(PlayerType.Diseased);
  }
  attacked(){

  }
}

class Vigilante extends Villager{
  constructor(){
    super(PlayerType.Vigilante)
  }
  action(players, lastVoteResult){
      this.kill(players, lastVoteResult)
  }
  kill(players, lastVoteResult){
    if(lastVoteResult.length > 2){
      if(lastVoteResult[1][1] == lastVoteResult[0][1]){
        players[lastVoteResult[1][0]].attacked();
        this.say("attack", lastVoteResult[1][0]);
      }
    }
  }
}

export {NormalVillager,Doctor,Cop, Diseased, Vigilante}
