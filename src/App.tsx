import GameBoard from "./GameBoard"
import './app.scss';
import { useState } from "react";
import MainMenu from "./MainMenu";

enum GameMode {
  MainMenu,
  ZenMode,
  TimeAttack
}

function App() {
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.MainMenu);

  let contents;
  if (gameMode === GameMode.MainMenu) {
    contents = <MainMenu
      selectZenMode={() => setGameMode(GameMode.ZenMode)}
      selectTimeAttack={() => setGameMode(GameMode.TimeAttack)}
    />;
  } else {
    contents = <GameBoard timerEnabled={gameMode === GameMode.TimeAttack} />;
  }

  return (
    <div className="wordris-app">
      {contents}
    </div>
  )
}

export default App
