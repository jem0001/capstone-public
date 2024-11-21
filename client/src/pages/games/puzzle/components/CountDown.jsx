import React, { useState, useRef } from "react";
import Countdown, { zeroPad } from "react-countdown";

const CountDown = () => {
  const countdownRef = useRef();

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
    console.log("Countdown completed!");
    // Perform any actions or state updates upon completion
  };

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <span>Time's up!</span>;
    } else {
      return (
        <span>
          {zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      );
    }
  };

  return (
    <div>
      <Countdown
        ref={countdownRef}
        date={Date.now() + 60000}
        autoStart={false}
        renderer={renderer}
        controlled={false}
        onComplete={handleCountdownComplete}
      />
      <div>
        <button onClick={handleStart}>Start</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleEnd}>End</button>
      </div>
    </div>
  );
};

export default CountDown;
