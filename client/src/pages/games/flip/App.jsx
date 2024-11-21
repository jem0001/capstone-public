import { useEffect, useState } from "react";
import { Board } from "./components/Board";
import { Button } from "@material-tailwind/react";
import { useGlobalSounds } from "../../../context/sound/SoundContext";
import { useGlobalFlip } from "./context/fllipContext";
import Pair from "./image/Pair.png";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { isMusicMuted, isMusicPlaying, playMusic, stopAndResetMusic } =
    useGlobalSounds();
  const { setCountdownStartTime, setRemainingTime, activity } = useGlobalFlip();

  useEffect(() => {
    return () => {
      console.log("stop reset music");
      stopAndResetMusic("pleasant");
    };
  }, []);
  return (
    <>
      <div className="w-full">
        {!isGameStarted ? (
          <div className="bg-[url('/src/assets/classroom.png')] bg-cover bg-no-repeat h-screen grid place-items-center">
            <img
              src={Pair}
              className="h-80 mb-[-5rem] rounded-2xl border-4 border-white"
              alt=" wala laman"
            />

            <Button
              onClick={() => {
                setIsGameStarted(!isGameStarted);
                const newCountdownStartTime =
                  Date.now() + 60000 * activity.timer;
                setCountdownStartTime(newCountdownStartTime);
                setRemainingTime(newCountdownStartTime);

                if (!isMusicPlaying && !isMusicMuted) {
                  console.log("playmusic");
                  playMusic("pleasant");
                }
              }}
              className="bg-[#059212] text-2xl tracking-widest">
              START GAME
            </Button>
          </div>
        ) : (
          <Board />
        )}
      </div>
    </>
  );
}

export default App;
