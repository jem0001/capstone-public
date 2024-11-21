import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { GameContext, useGameContext } from "../store/GameContext";
import { toast } from "react-toastify";
import { useGlobalContext } from "../../../../context/context";
import { useParams } from "react-router-dom";

export function QuestionsModal() {
  const { getActivity } = useGlobalContext();
  const { modalIsOpen, setModalIsOpen, decreaseTime } = useGameContext();
  const { x, y, play } = useContext(GameContext);
  const { week, id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleOpen = () => setModalIsOpen(!modalIsOpen);

  const handleAnswerClick = (answer) => {
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      play(x, y);
      handleOpen();
      setCurrentQuestionIndex(
        (prevIndex) => (prevIndex + 1) % questions.length
      );
      setSelectedAnswer(null);
    } else {
      toast.error("-3 seconds", { autoClose: 600 });
      decreaseTime();
    }
  };

  const handleOptionClick = (option) => {
    setSelectedAnswer(option);
    handleAnswerClick(option);
  };

  useEffect(() => {
    (async () => {
      const activity = await getActivity(id);
      setQuestions(activity.questions);
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
          {questions[currentQuestionIndex].question}
        </div>
        <div className="grid grid-cols-2 gap-3 text-lg">
          {questions[currentQuestionIndex].options.map((option, index) => (
            <div
              key={index}
              className={`${colors[index]} text-white rounded-lg border-2 p-4 h-56 grid hover:scale-105`}
              onClick={() => handleOptionClick(option)}
            >
              <button>{option}</button>
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
}
