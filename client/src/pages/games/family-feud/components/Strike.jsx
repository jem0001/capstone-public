import React, { useEffect, useRef, useState } from "react";
import ahhh from "../audio/ahhh.mp3";
import strike from "../audio/strike.mp3";

const Strike = (props) => {
  // Audio
  const strikeAudio = new Audio(strike);
  const ahhhAudio = new Audio(ahhh);

  // State variables from useState() in App.js
  const strikeCt = props.strikeCt;
  const setStrikeCt = props.setStrikeCt;

  // State
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  const handleOpen = () => {
    if (strikeCt < 3) {
      setStrikeCt(strikeCt + 1);
    } else if (strikeCt === 3) {
      setStrikeCt(1);
    }

    strikeAudio.play();
    ahhhAudio.play();
    setShow(true);
    console.log("playing soundheheh>");
  };

  const handleClose = () => setShow(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "x") {
        handleOpen();

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          handleClose();
          console.log("closing");
        }, 2500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [strikeCt, handleOpen, handleClose]);

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 rounded shadow-lg flex justify-center items-center">
            <span
              className={`${
                strikeCt >= 1 ? "wrong-answer-font mx-3 px-5" : ""
              }`}
            >
              {strikeCt >= 1 ? "X" : ""}
            </span>
            <span
              className={`${
                strikeCt >= 2 ? "wrong-answer-font mx-3 px-5" : ""
              }`}
            >
              {strikeCt >= 2 ? "X" : ""}
            </span>
            <span
              className={`${
                strikeCt >= 3 ? "wrong-answer-font mx-3 px-5" : ""
              }`}
            >
              {strikeCt >= 3 ? "X" : ""}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Strike;
