import React, { useEffect, useRef, useState } from "react";
import ahhh from "../audio/ahhh.mp3";
import strike from "../audio/strike.mp3";

const FaceoffStrike = () => {
  // Audio
  const strikeAudio = new Audio(strike);
  const ahhhAudio = new Audio(ahhh);

  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  const handleOpen = () => {
    strikeAudio.play();
    ahhhAudio.play();
    setShow(true);
  };
  const handleClose = () => setShow(false);

  useEffect(() => {
    console.log("useffectrunning");

    const handleKeyDown = (e) => {
      if (e.key === "X") {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        handleOpen();
        timerRef.current = setTimeout(() => {
          handleClose();
        }, 2500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      console.log("cleianing up");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleOpen]);

  return (
    <>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg p-4 w-1/3">
            <div className="flex justify-center">
              <h2 className="wrong-answer-font mx-3 px-5">X</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FaceoffStrike;
