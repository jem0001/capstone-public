import { useState } from "react";
import cheering from "../audio/cheering.mp3";
import correct from "../audio/correct.mp3";

const AnswerCard = (props) => {
  // Renaming prop variables for ease of use
  const currScore = props.currRoundScore;

  // States
  const [isFlipped, setIsFlipped] = useState(false);

  // Audio
  const correctAudio = new Audio(correct);
  const cheerAudio = new Audio(cheering);

  const onCardClick = (pts) => {
    if (!isFlipped) {
      setIsFlipped((currentState) => true);
      correctAudio.play();
      cheerAudio.play();
      if (!props.stop) {
        props.setRoundScore(currScore + pts);
      }
    }
  };

  return (
    <div
      className={"answer-card " + (isFlipped ? "flip" : "")}
      onClick={() => onCardClick(props.answerPts)}
    >
      <div className="front-face m-auto">
        <div className="answer grid grid-cols-6 items-center">
          <h1 className="text-white text-center game-font col-span-5 ">
            {props.answer}
          </h1>
          <div className="h-full bg-blue-500 flex items-center justify-center">
            <h1 className="text-white text-center game-font points col-span-1">
              {props.answerPts}
            </h1>
          </div>
        </div>
      </div>
      <div className="back-face grid place-items-center">
        <div className="oval grid place-items-center">
          <h1 className="text-white text-center number-font">
            {props.answerNum}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
