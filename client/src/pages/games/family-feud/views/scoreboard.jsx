import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TeamScore from "../components/TeamScore";
import { useGlobalFam } from "../famContext";
import { Spinner } from "@material-tailwind/react";
import QrReaderComponent from "../../../../components/qr-scanner/QrReaderComponent";
import { useGlobalContext } from "../../../../context/context";

const Scoreboard = (props) => {
  const { handleToggleScanner } = useGlobalContext();
  const { activity } = useGlobalFam();
  const navigate = useNavigate();
  // State variables from useState() in App.js
  // renaming them for easier use

  const {
    stop,
    setStop,
    round,
    setRound,
    team1Score,
    team2Score,
    setTeam1Score,
    setTeam2Score,
    startMusicAudio,
    isWinnerGiven,
    setIsWinnerGiven,
    isLoserGiven,
    setIsLoserGiven,
    resetGame,
  } = useGlobalFam();

  const handleNext = () => {
    startMusicAudio.current.pause();
    startMusicAudio.current.currentTime = 0;
    if (round < activity.questions.length) {
      setRound((prev) => {
        const curr = prev + 1;
        return curr;
      });
      navigate(`../round/${round + 1}`);

      setStop(false);
    } else {
      resetGame();
      navigate("../");
    }
  };

  // Effects
  useEffect(() => {
    console.log("Scoreboard rendered.");
  }, []);

  if (!activity) {
    return <Spinner />;
  }

  return (
    <div className="container-scoreboard">
      <TeamScore team1Score={team1Score} teamContainerClass="team-1" />
      <TeamScore team2Score={team2Score} teamContainerClass="team-2" />
      <div className="container-next-btn mx-auto">
        {round === activity.questions.length ? (
          !isWinnerGiven ? (
            <button
              className="next-btn-font bg-blue-500 rounded-lg px-16 py-4"
              onClick={() => {
                setIsWinnerGiven(true);
                handleToggleScanner();
              }}>
              Give Points to Winner
            </button>
          ) : !isLoserGiven ? (
            <button
              className="next-btn-font bg-blue-500 rounded-lg px-16 py-4"
              onClick={() => {
                setIsLoserGiven(true);
                handleToggleScanner();
              }}>
              Give Points to Loser
            </button>
          ) : (
            <button
              className="next-btn-font bg-blue-500 rounded-lg px-16 py-4"
              onClick={handleNext}>
              Restart Game
            </button>
          )
        ) : (
          <button
            className="next-btn-font bg-blue-500 rounded-lg px-16 py-4 uppercase font-bold tracking-widest"
            onClick={handleNext}>
            {round === 0 ? "Start Game" : "Next Round"}
          </button>
        )}
      </div>
      {/* QR MODALS */}
      {isLoserGiven ? (
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
      ) : isWinnerGiven ? (
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
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Scoreboard;
