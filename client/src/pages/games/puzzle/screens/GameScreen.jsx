import { useContext, useEffect, useState } from "react";
import GameBoard from "../components/board/GameBoard";
import GameControls from "../components/controls/GameControls";
import { GameContext } from "../store/GameContext";
import { QuestionsModal } from "../components/QuestionsModal";
import QrReaderComponent from "../../../../components/qr-scanner/QrReaderComponent";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useGlobalSounds } from "../../../../context/sound/SoundContext";
import { useGlobalContext } from "../../../../context/context";

/**
 * Game Screen component, renders the puzzle in GameBoard and the game information and buttons in GameControls
 * @returns {JSX.Element}
 * @constructor
 */
const GameScreen = () => {
  const { getActivity } = useGlobalContext();
  const {
    game,
    puzzleImage,
    openModal,
    modalIsOpen,
    closeModal,
    setActivity,
    activity,
    setCountdownStartTime,
  } = useContext(GameContext);

  const { week, id } = useParams();

  // useEffect(() => {
  //   if (activity) {
  //     setCountdownStartTime(Date.now() + 60000 + activity.timer);
  //   }
  // }, []);

  return (
    <>
      {puzzleImage && (
        <img
          src={puzzleImage}
          alt="Puzzle to Solve"
          className="size-56 rounded-lg"
        />
      )}

      <GameBoard />
      <GameControls />
      <QuestionsModal />
      {game?.gameWon && (
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
      {game?.gameLost && (
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
    </>
  );
};

export default GameScreen;
