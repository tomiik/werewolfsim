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
  action(players){
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
  action(players){
    this.identify(players);
    console.log(PlayerType[this.getType()] + " whitelist:" + this.whitelist)
  }
  identify(players){
    var count = 0;
    while(true){
      var target = this.pickTarget(players);
      console.log(target + ":" + this.whitelist[target]);
      if(this.whitelist[target] == undefined ){
        if(players[target].getType() == PlayerType.NormalWolf){
          this.whitelist[target] = false;
        }else{
          this.whitelist[target] = true;
        }
        this.say("identify", target)

        return;
      }
      if(count > players.length){
        return;
      }
      count++;
    }
  }
}

export {NormalVillager,Doctor,Cop}
