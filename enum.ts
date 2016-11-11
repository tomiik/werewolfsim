enum PlayerType {
    NormalWolf = 1,
    Rogue,
    NormalVillager,
    Doctor,
    Witch,
    LittleGirl
}

enum PlayerStatus {
  Healthy = 1,
  Attacked,
  Dead,
}

enum GameStatus {
  End_Wolves_Won = 1,
  End_Villagers_Won,
  //End_Draw,
  Not_End
}
export {PlayerType, PlayerStatus, GameStatus}
