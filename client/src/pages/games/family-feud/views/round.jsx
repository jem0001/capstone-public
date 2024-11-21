import { useEffect, useState } from "react";
import AnswerCard from "../components/AnswerCard";
import BlankCard from "../components/BlankCard";
import Strike from "../components/Strike";
import useKey from "../components/useKey";
import RoundScore from "../components/RoundScore";
import FaceoffStrike from "../components/FaceoffStrike";
import EndRound from "../components/EndRound";

// importing useSounds, sound files

import faceoff from "../audio/faceoff.mp3";
import roundWinner from "../audio/round_winner.mp3";
import { useParams } from "react-router-dom";
import { useGlobalFam } from "../famContext";
import { Spinner } from "@material-tailwind/react";

const faceoffAudio = new Audio(faceoff);

const Round = (props) => {
  // Audio
  const roundWinnerAudio = new Audio(roundWinner);

  // Keydown
  const space = useKey(" ");

  const {
    stop,
    setStop,
    round,
    setRound,
    team1Score,
    team2Score,
    setTeam1Score,
    setTeam2Score,
    activity,
    blankCount,
    setBlankCount,
    setActivity,
  } = useGlobalFam();

  // States
  const [roundScore, setRoundScore] = useState(0);
  const [strikeCt, setStrikeCt] = useState(0);
  const { roundNumber, id } = useParams();

  // Effects Helper Function
  const handleKeyDown = (e) => {
    if (e.key === "1" && !stop && roundScore !== 0) {
      roundWinnerAudio.play();
      setTeam1Score(roundScore + team1Score);
      setStop(true);
    } else if (e.key === "2" && !stop && roundScore !== 0) {
      roundWinnerAudio.play();
      setTeam2Score(roundScore + team2Score);
      setStop(true);
    }
  };

  // Effects

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener when the component unmounts or re-renders
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [roundScore, team1Score, team2Score]);

  // Play faceoff audio when space is pressed
  useEffect(() => {
    if (space) {
      faceoffAudio.pause();
      faceoffAudio.currentTime = 0;
      faceoffAudio.play();
    }
  }, [space]);

  // Set blankcount
  useEffect(() => {
    if (activity) {
      const length = activity.questions[roundNumber - 1].answers.length;
      const nextMultipleOf4 = Math.ceil(length / 4) * 4;

      if (length < 8) {
        setBlankCount(8 - length);
      } else if (nextMultipleOf4 > 0) {
        setBlankCount(nextMultipleOf4 - length);
      }
    }
  }, [roundNumber]);

  if (!activity) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  return (
    <div className="container-round grid place-items-center">
      <div
        className="circle-el w-[90vw] h-full bg-cover bg-no-repeat rounded-full bg-red-100 border-yellow-500 border-[10px] absolute z-0"
        style={{
          backgroundImage:
            'url("https://w0.peakpx.com/wallpaper/372/40/HD-wallpaper-black-background-with-gold-dots-golden-texture-creative-background-with-golden-circles-golden-mosaic-texture-black-and-gold-polka-dots.jpg")',
        }}>
        <div className="left bg-red-500 w-[15vw] absolute top-1/2 translate-y-[-50%] -left-[5%]  border-yellow-500 border-[6px] text-center text-white ">
          <h1 className="bg-white text-black text-2xl font-bold">TEAM-1</h1>
          <p className="grid place-items-center game-font text-6xl p-4">
            {team1Score}
          </p>
        </div>
        <div className="right bg-blue-500 w-[15vw] absolute top-1/2 translate-y-[-50%] -right-[5%]  border-yellow-500 border-[6px] text-center text-white ">
          <h1 className="bg-white text-black text-2xl font-bold">TEAM-1</h1>
          <p className="grid place-items-center game-font text-6xl p-4">
            {team2Score}
          </p>
        </div>
      </div>

      <div className="w-[70%] relative z-100 grid gap-4">
        <div className="">
          <RoundScore roundScore={roundScore} />
        </div>

        <div className="mx-auto w-[70%]  grid grid-flow-col grid-rows-4 max-h-[450px] min-h-[450px] overflow-y-auto ">
          {activity.questions[roundNumber - 1].answers.map((item, index) => {
            return (
              <AnswerCard
                key={item._id}
                answerNum={index + 1}
                answer={item.answer}
                answerPts={item.points}
                currRoundScore={roundScore}
                setRoundScore={setRoundScore}
                setStop={setStop}
                stop={stop}
              />
            );
          })}

          {Array.from({ length: blankCount }).map((item) => {
            return <BlankCard />;
          })}
        </div>

        {/* <div className="bg-black text-white text-xl p-4 rounded-md">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
          facere iusto quisquam qui consequatur recusandae. Lorem ipsum dolor
          sit amet consectetur adipisicing elit. Officiis, facere iusto quisquam
          qui consequatur recusandae.
        </div> */}
      </div>

      <FaceoffStrike />
      <Strike strikeCt={strikeCt} setStrikeCt={setStrikeCt} />
      <EndRound />
    </div>
  );
};

export default Round;
