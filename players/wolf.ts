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
  kill(players, lastVoteResult){
    var target;
    //kill less suspected
    if(lastVoteResult.length > 0){
      for(let i = lastVoteResult.length - 1; i > 0; i--){
        target = lastVoteResult[i][0];
        if(this.whitelist[target] != true && players[target].getStatus() != PlayerStatus.Dead){
          players[target].attacked();
          this.say("attack", target);

          //kill another if victim is the little girl
          if(players[target].getType() == PlayerType.LittleGirl){
            for(let j = i; j > 0 ; j--){
              target = lastVoteResult[j][0];
              if(this.whitelist[target] != true && players[target].getStatus() != PlayerStatus.Dead){
                this.say("attack", target);
                players[target].attacked();
                return true;
              }
            }
          }
          return true;
        }
      }
    }else{
      while(true){
        //kill randomly
        target = this.pickTarget(players);

        if(this.whitelist[target] != true){
            players[target].attacked();
            this.say("attack", target)

            //kill another if victim is the little girl
            if(players[target].getType() == PlayerType.LittleGirl){
              while(true){
                target = this.pickTarget(players);
                if(this.whitelist[target] != true){
                    players[target].attacked();
                    this.say("attack", target);
                    return true;
                  }
              }
            }
            return true;
        }
      }
    }
  }
  action(players, lastVoteResult){
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
  action(players, lastVoteResult){
    if(this.leader == true){
      this.kill(players, lastVoteResult);
    }
  }
}

class Rogue extends Wolf{
  constructor(){
    super(PlayerType.Rogue);
  }
  action(players, lastVoteResult){
    this.kill(players, lastVoteResult);
  }

}
export {NormalWolf, Rogue}
