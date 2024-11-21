import React, { useEffect, useState } from "react";
import Start from "./components/Start";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import { DataProvider } from "./context/dataContext";
import { useGlobalSounds } from "../../../context/sound/SoundContext";

function QuizGame({ setGameOpen }) {
  const { playMusic, stopAndResetMusic, isMusicMuted, isMusicPlaying } =
    useGlobalSounds();
  const [click, setClick] = useState(0);

  const handlePlay = () => {
    if (click === 0) {
      setClick(click + 1);
      if (!isMusicPlaying && !isMusicMuted) {
        playMusic("pleasant");
      }
    }
  };
  useEffect(() => {
    return () => {
      stopAndResetMusic("pleasant");
    };
  }, []);
  return (
    <DataProvider>
      <div
        className="absolute top-0 left-0 w-screen h-screen"
        onClick={handlePlay}
      >
        {/* Welcome Page */}
        <Start />

        {/* Quiz Page */}
        <Quiz />

        {/* Result Page */}
        <Result setGameOpen={setGameOpen} />
      </div>
    </DataProvider>
  );
}

export default QuizGame;
