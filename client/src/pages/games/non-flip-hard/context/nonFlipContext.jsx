import { createContext, useContext, useEffect, useRef, useState } from "react";
import { zeroPad } from "react-countdown";
import { useGlobalSounds } from "../../../../context/sound/SoundContext";
import { useGlobalContext } from "../../../../context/context";
import { useParams } from "react-router-dom";

const NonFlipContext = createContext();

const NonFlipProvider = ({ children }) => {
  const { getActivity, handleToggleScanner } = useGlobalContext();

  const { stopAndResetMusic, playYouLose } = useGlobalSounds();
  const { id } = useParams();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [gameState, setGameState] = useState("playing");
  const [activity, setActivity] = useState([]);
  const [imageUrlArg, setImageUrlArg] = useState();
  const [currScore, setCurrScore] = useState(0);

  // COUNTDOWN
  const countdownRef = useRef();

  const [navigateFlag, setNavigateFlag] = useState(false);

  // fix navigate/timer bug
  const [countdownStartTime, setCountdownStartTime] = useState(Date.now());

  //minus 3 seconds
  const [remainingTime, setRemainingTime] = useState(countdownStartTime);

  const decreaseTime = () => {
    setRemainingTime((prevTime) => prevTime - 3000);
  };

  const handleStart = () => {
    countdownRef.current.start();
  };

  const handlePause = () => {
    countdownRef.current.pause();
  };

  const handleEnd = () => {
    countdownRef.current.stop();
  };
  const handleCountdownComplete = () => {
    // if (!game) return;
    handleToggleScanner();
    setGameState("lost");
    stopAndResetMusic("pleasant");
    playYouLose();
    // closeModal();
    console.log("Countdown completed! game lost, talo");

    // Perform any actions or state updates upon completion
  };
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Time's up!</span>;
    } else {
      return (
        <span>
          {hours > 0 && `${zeroPad(hours)}:`}
          {zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      );
    }
  };
  // COUNTDOWN END

  // fetch data
  useEffect(() => {
    (async () => {
      const activity = await getActivity(id);
      setActivity(activity);
    })();
  }, []);

  return (
    <NonFlipContext.Provider
      value={{
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
        gameState,
        setGameState,
        modalIsOpen,
        setModalIsOpen,
        imageUrlArg,
        setImageUrlArg,
        activity,
        currScore,
        setCurrScore,
      }}
    >
      {children}
    </NonFlipContext.Provider>
  );
};

export const useGlobalNonFlip = () => {
  return useContext(NonFlipContext);
};

export default NonFlipProvider;
