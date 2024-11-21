import { createContext, useContext, useEffect, useRef, useState } from "react";
import { zeroPad } from "react-countdown";
import { useGlobalSounds } from "../../../../context/sound/SoundContext";
import { useGlobalContext } from "../../../../context/context";
import { useParams } from "react-router-dom";

const FlipContext = createContext();

const FlipProvider = ({ children }) => {
  const { getActivity, handleToggleScanner } = useGlobalContext();

  const { stopAndResetMusic, playYouLose } = useGlobalSounds();
  const { id } = useParams();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [activity, setActivity] = useState(null);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [matchCounter, setMatchCounter] = useState(0);

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
    // setGameState("lost");
    setWon(false);
    setIsDisabled(true);
    setGameOver(true);
    stopAndResetMusic("pleasant");
    playYouLose();
    setModalIsOpen(false);
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
    <FlipContext.Provider
      value={{
        modalIsOpen,
        setModalIsOpen,
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
        setActivity,
        gameOver,
        setGameOver,
        isDisabled,
        setIsDisabled,
        won,
        setWon,
        matchCounter,
        setMatchCounter,
      }}
    >
      {children}
    </FlipContext.Provider>
  );
};

export const useGlobalFlip = () => {
  return useContext(FlipContext);
};

export default FlipProvider;
