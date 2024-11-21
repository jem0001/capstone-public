import { useEffect } from "react";
import { useGlobalSounds } from "../../../context/sound/SoundContext";
import App from "./App";
import { SoundSettings } from "../../../components/SoundSettings";

const Hangman = () => {
  const { stopAndResetMusic } = useGlobalSounds();

  useEffect(() => {
    return () => {
      console.log("stop reset music");
      stopAndResetMusic("pleasant");
    };
  }, []);
  return (
    <div className="w-full">
      <App />
      <div className="absolute top-2 right-2">
        <SoundSettings />
      </div>
    </div>
  );
};
export default Hangman;
