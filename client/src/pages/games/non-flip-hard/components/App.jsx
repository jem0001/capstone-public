import React, { useEffect } from "react";
import { useState } from "react";
import PlayGame from "./PlayGame";
import { useGlobalNonFlip } from "../context/nonFlipContext";
import { useGlobalSounds } from "../../../../context/sound/SoundContext";
import QrReaderComponent from "../../../../components/qr-scanner/QrReaderComponent";
import bgImage from "../../../../assets/GamesBG/MemoryHard.png";

function App() {
  const { playMusic, isMusicMuted, isMusicPlaying } = useGlobalSounds();
  const {
    countdownRef,
    navigateFlag,
    setNavigateFlag,
    countdownStartTime,
    setCountdownStartTime,
    remainingTime,
    setRemainingTime,
    decreaseTime,
    handleStart,
    handlePause,
    handleEnd,
    handleCountdownComplete,
    renderer,
    activity,
    gameState,
    currScore,
    setCurrScore,
  } = useGlobalNonFlip();

  const [gamemode, setGamemode] = useState("easy");
  const [startGame, setStartGame] = useState(false);

  if (startGame) {
    return (
      <div className="h-full bg-[url('/src/assets/darkBlueBg.jpg')] bg-cover bg-no-repeat">
        <PlayGame gamemode={gamemode} />
        {gameState === "won" && (
          <QrReaderComponent
            message={"You win"}
            pointsAdded={activity.winPoints * currScore}
            status={"won"}
            from={activity.name}
            quarter={activity.quarter}
            week={activity.week}
            activityNumber={activity.activityNumber}
            type={activity.type}
          />
        )}
        {gameState === "lost" && (
          <QrReaderComponent
            message={"You lose, but gained"}
            pointsAdded={activity.winPoints * currScore}
            status={"lost"}
            from={activity.name}
            quarter={activity.quarter}
            week={activity.week}
            activityNumber={activity.activityNumber}
            type={activity.type}
          />
        )}
      </div>
    );
  } else {
    return (
      <div className="h-full grid place-items-center">
        <div className="flex items-center justify-center flex-col gap-20 bg-slate-950 text-slate-200">
          <div>
            <img
              src={bgImage}
              className="h-80 mb-[-5rem] rounded-2xl border-4 border-white"
            />
          </div>
          <div className="flex gap-10 text-3xl text-slate-200">
            <button
              className="bg-[#059212] text-2xl tracking-widest uppercase px-16 py-4 font-bold rounded-lg mt-8"
              onClick={() => {
                setGamemode("easy");
                setStartGame(true);
                const newCountdownStartTime =
                  Date.now() + 60000 * activity.timer;
                setCountdownStartTime(newCountdownStartTime);
                setRemainingTime(newCountdownStartTime);

                setNavigateFlag(!navigateFlag);
                if (!isMusicPlaying && !isMusicMuted) {
                  console.log("layout");
                  playMusic("pleasant");
                }
              }}>
              Start game
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
