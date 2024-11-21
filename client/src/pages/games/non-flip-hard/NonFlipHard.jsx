import { useEffect } from "react";
import App from "./components/App";
import NonFlipProvider, { useGlobalNonFlip } from "./context/nonFlipContext";
import { useGlobalContext } from "../../../context/context";
import { useGlobalSounds } from "../../../context/sound/SoundContext";
import { SoundSettings } from "../../../components/SoundSettings";

const NonFlipHard = () => {
  const { stopAndResetMusic } = useGlobalSounds();

  useEffect(() => {
    return () => {
      console.log("stop reset music");
      stopAndResetMusic("pleasant");
    };
  }, []);

  return (
    <NonFlipProvider>
      <div className="h-full w-full bg-[url('/src/assets/classroom.png')] bg-cover bg-no-repeat ">
        <div className=" text-white  mx-auto h-full">
          <App />
          <div className="absolute top-2 right-2">
            <SoundSettings />
          </div>
        </div>
      </div>
    </NonFlipProvider>
  );
};
export default NonFlipHard;
