import { useEffect } from "react";
import { Link } from "react-router-dom";
import familyFeudLogo from "../imgs/Clash.png";
import useKey from "../components/useKey";
import { useGlobalFam } from "../famContext";

const StartGame = () => {
  const { startMusicAudio } = useGlobalFam();

  useEffect(() => {
    console.log("Start game rendered.");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/src/assets/classroom.png')] bg-cover bg-no-repeat ">
      <div className="text-center">
        <img
          src={familyFeudLogo}
          alt="Family Feud Logo"
          className="h-80 rounded-2xl border-4 mb-12 border-white"
        />
        <div>
          <Link
            onClick={() => {
              startMusicAudio.current.play();
            }}
            to="scoreboard"
            className="bg-[#059212] text-2xl tracking-widest text-white px-16 py-4 rounded-lg font-bold">
            START GAME
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StartGame;
