import React, { useContext, useState, useEffect } from "react";
import DataContext from "../context/dataContext";
import QrReaderComponent from "../../../../components/qr-scanner/QrReaderComponent";
import { SoundSettings } from "../../../../components/SoundSettings";
import Confetti from "react-confetti";
import { useGlobalContext } from "../../../../context/context";

const Quiz = () => {
  const {
    showQuiz,
    question,
    questions,
    checkAnswer,
    correctAnswer,
    selectedAnswer,
    questionIndex,
    nextQuestion,
    showTheResult,
    answerStatus,
    activity,
  } = useContext(DataContext);

  const { showConfetti, setShowConfetti, handleConfettiComplete } =
    useGlobalContext();

  const [confettiPieces, setConfettiPieces] = useState(0);

  return (
    <>
      <div
        className={`bg-[url('/src/pages/3d/quizImages/BlackBoard.png')] bg-cover text-white ${
          showQuiz ? "block" : "hidden"
        }`}>
        <div className="container mx-auto">
          <div className="flex h-screen items-center justify-center">
            <div className="max-w-lg">
              <div className="p-4 bg-transparent rounded-lg">
                <div className="flex justify-between gap-3">
                  <h5 className="mb-2 text-base leading-normal font-extrabold ">
                    {question?.question}
                  </h5>
                  <h5 className="text-white w-fit text-right font-extrabold text-nowrap">
                    {questions.indexOf(question) + 1} / {questions?.length}
                  </h5>
                </div>
                <div>
                  {question?.options?.map((item, index) => (
                    <button
                      key={index}
                      className={`w-full text-left py-2 px-3 mt-3 rounded ${
                        correctAnswer === item
                          ? "bg-green-500"
                          : selectedAnswer === item
                          ? "bg-red-500"
                          : `bg-gray-800 ${
                              !selectedAnswer && "hover:bg-gray-600"
                            }`
                      }`}
                      onClick={(event) => {
                        checkAnswer(event, item);
                      }}
                      disabled={!!selectedAnswer}>
                      {item}
                    </button>
                  ))}
                </div>

                {questionIndex + 1 !== questions.length ? (
                  <button
                    className="w-full py-2 mt-3 bg-transparent text-white font-bold rounded border-white border-2 hover:bg-white hover:text-black"
                    onClick={nextQuestion}
                    disabled={!selectedAnswer}>
                    Next Question
                  </button>
                ) : (
                  <button
                    className="w-full py-2 mt-3 bg-transparent text-white font-bold rounded border-white border-2 hover:bg-white hover:text-black"
                    onClick={showTheResult}
                    disabled={!selectedAnswer}>
                    Show Result
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {answerStatus === "correct" && (
          <QrReaderComponent
            message={"You win"}
            pointsAdded={activity.winPoints}
            status={"won"}
            from={activity.name}
            quarter={activity.quarter}
            week={activity.week}
            activityNumber={activity.activityNumber}
            type={activity.type}
          />
        )}
        {answerStatus === "incorrect" && (
          <QrReaderComponent
            message={"You lose, but gained"}
            pointsAdded={activity.losePoints}
            status={"lost"}
            from={activity.name}
            quarter={activity.quarter}
            week={activity.week}
            activityNumber={activity.activityNumber}
            type={activity.type}
          />
        )}
        <div className="absolute top-2 right-2">
          <SoundSettings />
        </div>
      </div>
      {/* Confetti Effect */}
      {/* {showConfetti && (
        <div className="z-[9999999999999999] h-screen w-screen bg-tranparent absolute top-0 left-0">
          <Confetti
            numberOfPieces="5000"
            recycle={false}
            onConfettiComplete={handleConfettiComplete}
          />
        </div>
      )} */}
    </>
  );
};

export default Quiz;
