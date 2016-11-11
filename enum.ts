enum PlayerType {
    NormalWolf = 1,
    Rogue,
    NormalVillager,
    Doctor,
    Witch,
    LittleGirl,
    Cop,
    Diseased,
    Vigilante,
    ToughGuy,
    Cupid
}

enum PlayerStatus {
  Healthy = 1,
  Attacked,
  Dying,
  Dead,
}

enum GameStatus {
  End_Wolves_Won = 1,
  End_Villagers_Won,
  //End_Draw,
  Not_End
}
export {PlayerType, PlayerStatus, GameStatus}
