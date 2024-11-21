import React, { useContext, useEffect } from "react";
import DataContext from "../context/dataContext";
import { useNavigate } from "react-router-dom";
import { useGlobalSounds } from "../../../../context/sound/SoundContext";

const Result = ({ setGameOpen }) => {
  const { stopAndResetMusic } = useGlobalSounds();
  const { showResult, questions, marks, startOver } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (showResult) {
      stopAndResetMusic("pleasant");
    }
  }, [showResult]);
  return (
    <section
      className={`bg-[url('/src/pages/3d/quizImages/BlackBoard.png')] bg-cover text-white ${
        showResult ? "block" : "hidden"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex h-screen items-center justify-center">
          <div className="max-w-lg">
            <div
              className={`text-center p-12 rounded ${
                marks > questions.length / 2 ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <h1 className="mb-2 font-bold">
                {marks > questions.length / 2 ? "Awesome!" : "Oops!"}
              </h1>
              <h3 className="mb-3 font-bold">
                Your score is {marks} out of {questions.length}
              </h3>

              <div className="flex flex-col gap-4">
                <button
                  onClick={startOver}
                  className="py-2 px-4 bg-white text-black font-bold rounded inline-block"
                >
                  Start Over
                </button>
                <button
                  onClick={() => {
                    setGameOpen(false);
                  }}
                  className="py-2 px-4 bg-white text-black font-bold rounded inline-block"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Result;
