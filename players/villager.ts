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
    super(PlayerType.Doctor)
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

export {NormalVillager,Doctor}
