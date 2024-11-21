import React, { act, useEffect, useState } from "react";
import { questions } from "../data";
import { Card } from "./Card";
import { Modal } from "./Modal";
import { useGlobalFlip } from "../context/fllipContext";
import Countdown from "react-countdown";
import { BsActivity } from "react-icons/bs";
import { QuestionsModal } from "./QuestionsModal";
import { useGlobalSounds } from "../../../../context/sound/SoundContext";
import { useGlobalContext } from "../../../../context/context";
import QrReaderComponent from "../../../../components/qr-scanner/QrReaderComponent";
import BG from "../image/Bg.png";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const Board = () => {
  const {
    countdownRef,
    remainingTime,
    handleCountdownComplete,
    renderer,
    decreaseTime,
    activity,
    modalIsOpen,
    setModalIsOpen,
    gameOver,
    setGameOver,
    isDisabled,
    setIsDisabled,
    setCountdownStartTime,
    setRemainingTime,
    won,
    setWon,
    handleStart,
    navigateFlag,
    setNavigateFlag,
    matchCounter,
    setMatchCounter,
    handlePause,
  } = useGlobalFlip();

  const { handleToggleScanner } = useGlobalContext();

  const {
    playMusic,
    isMusicMuted,
    isMusicPlaying,
    stopAndResetMusic,
    playYouWin,
    playCorrect,
    playWrong,
  } = useGlobalSounds();

  const [clickedImageId, setClickedImagedId] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);

  const createBoard = () => {
    const duplicatecards = activity.questions.flatMap((item) => {
      const duplicate = {
        ...item,
        _id: item._id + "-duplicate", // Adjust `_id` for duplicate cards
      };
      return [item, duplicate];
    });

    const newCards = shuffleArray(duplicatecards);
    const cards = newCards.map((card) => ({
      ...card,
      flipped: false,
      matched: false,
    }));
    setCards(cards);
  };

  useEffect(() => {
    console.log("activity contenttttt", activity);
  }, [activity]);

  useEffect(() => {
    if (activity) {
      createBoard();
    }
  }, [activity]);

  const handleCardClick = (_id) => {
    if (isDisabled) return;

    const updatedCards = [...cards];
    const clickedCard = updatedCards.find((card) => card._id === _id);

    // Prevent flipping already flipped or matched cards
    if (!clickedCard.flipped && !clickedCard.matched) {
      clickedCard.flipped = true;

      const newFlippedCards = [...flippedCards, clickedCard];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        setIsDisabled(true);
        const [firstCard, secondCard] = newFlippedCards;

        if (firstCard.imageUrl === secondCard.imageUrl) {
          console.log("matched");
          playCorrect();
          firstCard.matched = true;
          secondCard.matched = true;
          setFlippedCards([]);
          setIsDisabled(false);

          setTimeout(() => {
            setModalIsOpen(true);
            const duplicateRemoved = _id.replace("-duplicate", "");
            setClickedImagedId(duplicateRemoved);
          }, 800);
        } else {
          // Delay flipping cards back
          console.log("doesn't match");
          // playWrong();
          setTimeout(() => {
            firstCard.flipped = false;
            secondCard.flipped = false;
            setCards([...updatedCards]);
            setFlippedCards([]);
            setIsDisabled(false);
          }, 1000); // Delay of 1 second for smooth animation
        }

        setMoves(moves + 1);
      }

      setCards([...updatedCards]);
    }

    // if (updatedCards.every((card) => card.matched)) {
    //   handleToggleScanner();
    //   setGameOver(true);
    //   setIsDisabled(true);
    //   setWon(true);
    //   console.log("won");

    //   //   winning condition
    // }
  };

  const handleWon = () => {
    handleToggleScanner();
    handlePause();
    playYouWin();
    stopAndResetMusic("pleasant");
    setGameOver(true);
    setIsDisabled(true);
    setWon(true);
    console.log("won");
  };

  const handleNewGame = () => {
    createBoard();
    setMoves(0);
    setMatchCounter(0);
    setGameOver(false);
    setIsDisabled(false);

    const newCountdownStartTime = Date.now() + 60000 * activity.timer;
    setCountdownStartTime(newCountdownStartTime);
    setRemainingTime(newCountdownStartTime);
    setNavigateFlag(!navigateFlag);

    if (!isMusicPlaying && !isMusicMuted) {
      console.log("playmusic");
      playMusic("pleasant");
    }
  };

  useEffect(() => {
    handleStart();
  }, [navigateFlag]);

  return (
    <>
      {gameOver && (
        <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
      )}

      <div
        className="relative min-h-screen flex items-center bg-yellow bg-[#00712D]"
        style={{
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <div className="mx-auto flex flex-col justify-center items-center">
          <div
            className="shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]
          px-12 py-4 bg-blue-800 my-4 rounded-lg text-white font-bold text-3xl tracking-widest">
            <Countdown
              ref={countdownRef}
              date={remainingTime}
              autoStart={true}
              renderer={renderer}
              controlled={false}
              onComplete={handleCountdownComplete}
            />
          </div>
          {/* <button
            onClick={decreaseTime}
            className="bg-[#af1d20] p-2 text-white rounded-lg ml-2 shadow-2xl">
            Decrease Time by 3 Seconds
          </button> */}

          <div className="grid grid-cols-5 gap-3 justify-center items-center px-3 py-5 my-3">
            {cards.map((card) => (
              <Card
                card={card}
                key={card._id} // Use `_id` for keys and interactions
                handleCardClick={handleCardClick}
              />
            ))}
          </div>
          {/* <button
            className="bg-[#f162c6] font-semibold text-white rounded-md px-7 py-3 transition-all mb-3"
            onClick={handleNewGame}
          >
            NEW GAME
          </button> */}
        </div>

        <Modal
          gameOver={gameOver}
          setGameOver={setGameOver}
          moves={moves}
          handleNewGame={handleNewGame}
          message={won ? "YOU WON" : "YOU LOST"}
          won={won}
          matchCounter={matchCounter}
          activity={activity}
        />
      </div>
      <QuestionsModal
        clickedImageId={clickedImageId}
        matchCounter={matchCounter}
        setMatchCounter={setMatchCounter}
        handleWon={handleWon}
      />

      {gameOver && won && matchCounter == activity.questions.length && (
        <QrReaderComponent
          message={"You win"}
          pointsAdded={activity.winPoints * matchCounter}
          status={"won"}
          from={activity.name}
          quarter={activity.quarter}
          week={activity.week}
          activityNumber={activity.activityNumber}
          type={activity.type}
        />
      )}
      {gameOver && !won && (
        <QrReaderComponent
          message={"You lose, but gained"}
          pointsAdded={activity.winPoints * matchCounter}
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
