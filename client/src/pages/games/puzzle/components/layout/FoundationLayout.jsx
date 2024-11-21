import { useEffect, useRef, useState } from "react";
import { useGlobalSounds } from "../../../../../context/sound/SoundContext";
import { SoundSettings } from "../../../../../components/SoundSettings";

/**
 * Outer wrapper of the entire app,
 * places the app content in the center of the screen and sets a top level background
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
const FoundationLayout = ({ children }) => {
  // for playing sound

  const [click, setClick] = useState(0);
  const {
    playMusic,
    isMusicPlaying,
    toggleMusicMute,
    isMusicMuted,
    stopAndResetMusic,
    pauseMusic,
  } = useGlobalSounds();

  const handlePlay = () => {
    if (click === 0) {
      setClick(click + 1);
      if (!isMusicPlaying && !isMusicMuted) {
        console.log("layout");
        playMusic("pleasant");
      }
    }
  };

  useEffect(() => {
    return () => {
      console.log("stop reset music");
      stopAndResetMusic("pleasant");
    };
  }, []);

  return (
    <div
      className="bg-[url('./assets/images/background.jpg')] bg-cover bg-center puzzle-game"
      onClick={handlePlay}
    >
      <div className="bg-red-100 min-h-screen flex items-center justify-center">
        <div
          className="flex flex-col md:flex-row gap-6 p-4 bg-gradient-to-t from-red-600 to-slate-50 border-[#af1d20] 
        border-4 rounded-lg"
        >
          {children}
        </div>
      </div>
      <div className="absolute right-1 top-1 grid">
        <SoundSettings />
      </div>
    </div>
  );
};

export default FoundationLayout;
