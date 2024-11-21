import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useGlobalContext } from "../../../../context/context";
import { useParams } from "react-router-dom";
import { useGlobalFlip } from "../context/fllipContext";

export function QuestionsModal({
  clickedImageId,
  matchCounter,
  setMatchCounter,
  handleWon,
}) {
  const { getActivity } = useGlobalContext();
  const { modalIsOpen, setModalIsOpen, decreaseTime, activity } =
    useGlobalFlip();
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);

  const handleOpen = () => setModalIsOpen(!modalIsOpen);

  const handleAnswerClick = (answer) => {
    const clickedImage = questions.find((item) => item._id === clickedImageId);
    if (answer === clickedImage.correctAnswer) {
      handleOpen();
      setMatchCounter(matchCounter + 1);

      // winning condition
      if (matchCounter + 1 === activity.questions.length) {
        handleWon();
      }
    } else {
      toast.error("-3 seconds", { autoClose: 600 });
      decreaseTime();
    }
  };

  const handleOptionClick = (option) => {
    handleAnswerClick(option);
  };

  useEffect(() => {
    (async () => {
      const activity = await getActivity(id);
      setQuestions(activity.questions);
      console.log("questionsmodal questions", activity.questions);
    })();
  }, []);

  if (questions.length === 0) {
    return null;
  }

  const colors = ["bg-red-900", "bg-blue-900", "bg-green-900", "bg-orange-900"];

  return (
    <>
      <Dialog
        open={modalIsOpen}
        handler={handleOpen}
        className="p-4"
        dismiss={{ enabled: false }}
      >
        <div className="p-4 text-xl uppercase text-center text-black">
          {questions.map((item) => {
            if (item._id === clickedImageId) {
              return item.question;
            }
          })}
        </div>
        <div className="grid grid-cols-2 gap-3 text-lg">
          {questions.map((item) => {
            return (
              item._id === clickedImageId &&
              item.options.map((option, index) => (
                <div
                  key={index}
                  className={`${colors[index]} text-white rounded-lg border-2 p-4 h-56 grid hover:scale-105`}
                  onClick={() => handleOptionClick(option)}
                >
                  <button>{option}</button>
                </div>
              ))
            );
          })}
        </div>
      </Dialog>
    </>
  );
}
