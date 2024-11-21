import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../store/GameContext";
import { IoMdTime } from "react-icons/io";
import GameInfo from "./GameInfo";
import Countdown, { zeroPad } from "react-countdown";

/**
 * Renders a clock showing the time elapsed
 * @returns {JSX.Element}
 * @constructor
 */
const GameClock = () => {
  const {
    game,
    handleCountdownComplete,
    countdownRef,
    countdownStartTime,
    setCountdownStartTime,
    navigateFlag,
    decreaseTime,
    remainingTime,
    setRemainingTime,
    activity,
  } = useContext(GameContext);

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

  // Fix navigate/timer bug
  useEffect(() => {
    if (activity) {
      const newCountdownStartTime = Date.now() + 60000 * activity.timer;
      setCountdownStartTime(newCountdownStartTime);
      setRemainingTime(newCountdownStartTime);
    }
  }, [navigateFlag, activity]);

  // Function to decrease the time by 3 seconds

  return (
    <GameInfo label="TIME" icon={<IoMdTime />}>
      {remainingTime && (
        <Countdown
          ref={countdownRef}
          date={remainingTime}
          autoStart={false}
          renderer={renderer}
          controlled={false}
          onComplete={handleCountdownComplete}
          className="font-black"
        />
      )}
      {/* <button
        onClick={decreaseTime}
        className="bg-[#af1d20] p-2 text-white rounded-lg ml-2 shadow-2xl"
      >
        Decrease Time by 3 Seconds
      </button> */}
    </GameInfo>
  );
};

export default GameClock;
