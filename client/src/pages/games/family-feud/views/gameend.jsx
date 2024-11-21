import { useEffect } from "react";
import familyFeudLogo from "../imgs/family_feud_baby_shower_ed.png";
import useKey from "../components/useKey";
import endMusic from "../audio/end_game.mp3";

const GameEnd = () => {
  const space = " ";
  const endMusicAudio = new Audio(endMusic);

  if (useKey(space)) {
    endMusicAudio.play();
  }

  useEffect(() => {
    console.log("End game rendered.");
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white py-3">
          THANKS FOR PLAYING!
        </h1>
        <img
          src={familyFeudLogo}
          alt="Family Feud Logo"
          className="mx-auto w-64 h-auto"
        />
      </div>
    </div>
  );
};

export default GameEnd;
