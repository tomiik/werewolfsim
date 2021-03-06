import {PlayerType, PlayerStatus} from "../enum"
import Player from "./player"

class Villager extends Player{
  constructor(type){
    super(type)
  }
}

class NormalVillager extends Villager{
  constructor(){
    super(PlayerType.NormalVillager);
  }
}

class Doctor extends Villager{
  constructor(playerType = PlayerType.Doctor){
    super(playerType);
  }
  action(players, lastVoteResult){
    var target = this.pickTarget(players)
    this.cure(players, target);
  }
  cure(players, target){
    players[target].cured();
    this.say("cure", target);
  }
}

class Cop extends Villager{
  constructor(playerType = PlayerType.Cop){
    super(playerType);
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
        if( players[target].getType() == PlayerType.NormalWolf ||
            players[target].getType() == PlayerType.Rogue){
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
    super(PlayerType.Vigilante);
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

class Witch extends Doctor{
  poison:number;
  potion:number;
  constructor(){
    super(PlayerType.Witch);
    this.poison = 1;
    this.potion = 1;
  }
  action(players, lastVoteResult){
    var dice = Math.floor(Math.random() * 6);
    if(dice == 1){
      if(this.poison > 0){
        for(let i = 1; i < lastVoteResult.length; i++){
          if(lastVoteResult[i][0].getStatus != PlayerStatus.Dead){
            this.usePoison(players, i);
            return;
          }
        }
      }
    }
    else if(dice == 2){
      if(this.potion > 0){
        for(let i = lastVoteResult.length - 1; i > 0; i--){
          if(lastVoteResult[i][0].getStatus != PlayerStatus.Dead){
            this.usePotion(players, i);
            return;
          }
        }
      }
    }
  }
  usePoison(players, target){
    players[target].attacked();
    this.say("attacked", target);
  }
  usePotion(players, target){
    this.cure(players,target);
  }
}

class ToughGuy extends Villager{
  energy: number;
  constructor(){
    super(PlayerType.ToughGuy);
    this.energy = 1;
  }
  action(){
    if(this.getStatus() == PlayerStatus.Dying){
      if(this.energy <= 0){
        this.setStatus(PlayerStatus.Attacked);
      }
      this.energy--;
    }
  }
  attacked(){
    this.setStatus(PlayerStatus.Dying);
  }
}

class Cupid extends Villager{
  madeCouple: boolean;
  constructor(){
    super(PlayerType.Cupid);
    this.madeCouple = false;
  }
  action(players){
    if(this.madeCouple == false){
      this.makeCouple(players)
      this.madeCouple = true;
    }
  }
  makeCouple(players){
    while(true){
      var target1 = this.pickTarget(players);
      var target2 = this.pickTarget(players);
      if(target1 != target2 && target1 != this.getId() && target2 != this.getId()){
        this.say("make couple", target1 + "<->" + target2)
        players[target1].setPartner(target2);
        players[target2].setPartner(target1);
        return;
      }
    }
  }
}

class LittleGirl extends Cop{
  constructor(){
    super(PlayerType.LittleGirl);
  }
  killed(){
    super.killed();
  }
}

class Mason extends Villager{
  constructor(){
    super(PlayerType.Mason);
  }
  identifyMasons(players){
    for(let i = 0; i < players.length; i++){
      if(players[i].getType() == PlayerType.Mason){
        this.whitelist[i] = true;
      }
    }
  }
}

export {NormalVillager,Doctor,Cop, Diseased, Vigilante, Witch, ToughGuy, Cupid, LittleGirl, Mason}
