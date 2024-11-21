import React, { useState } from "react";
import { useEffect } from "react";
import Countdown from "react-countdown";
import { useGlobalNonFlip } from "../context/nonFlipContext";
import { useGlobalSounds } from "../../../../context/sound/SoundContext";
import { QuestionsModal } from "./QuestionsModal";
import { motion } from "framer-motion";
import { Spinner } from "@material-tailwind/react";
import { useGlobalContext } from "../../../../context/context";

function PlayGame(props) {
  const { handleToggleScanner } = useGlobalContext();
  const {
    playMusic,
    stopAndResetMusic,
    playYouLose,
    playYouWin,
    isMusicMuted,
    isMusicPlaying,
  } = useGlobalSounds();

  const {
    countdownRef,
    navigateFlag,
    setNavigateFlag,
    countdownStartTime,
    setCountdownStartTime,
    remainingTime,
    setRemainingTime,
    decreaseTime,
    handleStart,
    handlePause,
    handleEnd,
    handleCountdownComplete,
    renderer,
    gameState,
    setGameState,
    modalIsOpen,
    setModalIsOpen,
    imageUrlArg,
    setImageUrlArg,
    activity,
    currScore,
    setCurrScore,
  } = useGlobalNonFlip();

  const [bestScore, setBestScore] = useState(0);
  const [countries, setCountries] = useState([]);
  const [clickedImageId, setClickedImageId] = useState();
  const [buttonColorClass, setButtonColorClass] = useState(
    "hover:text-green-500"
  );

  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const [randomCountries, setRandomCountries] = useState([]);

  const [clickedCountry, setClickedCountry] = useState([]);

  const handleRandomizeClick = (e) => {
    if (clickedCountry.includes(e.target.alt) === false) {
      if (currScore >= bestScore) {
        setBestScore(currScore + 1);
      }

      setClickedCountry([...clickedCountry, e.target.alt]);
      setModalIsOpen(true);
    } else {
      setGameState("lost");
      stopAndResetMusic("pleasant");
      playYouLose();
      handleToggleScanner();
    }
    const shuffledArray = shuffle(countries);
    setRandomCountries(shuffledArray);
  };

  const playAgain = () => {
    setImageUrlArg(null);
    setModalIsOpen(false);
    setCurrScore(0);
    setClickedCountry([]);
    setGameState("playing");
    const newCountdownStartTime = Date.now() + 60000 * activity.timer;
    setCountdownStartTime(newCountdownStartTime);
    setRemainingTime(newCountdownStartTime);
    if (!isMusicPlaying && !isMusicMuted) {
      console.log("layout");
      playMusic("pleasant");
    }
  };

  const handlePlayerWin = () => {
    if (currScore + 1 === countries.length) {
      setGameState("won");
      stopAndResetMusic("pleasant");
      playYouWin();
      handleToggleScanner();
    }
  };

  useEffect(() => {
    const newCountries = activity.questions.map((item) => item);
    setCountries(newCountries);
    console.log(newCountries);
  }, []);

  useEffect(() => {
    console.log(" country value", countries);
    const shuffledArray = shuffle(countries);
    setRandomCountries(shuffledArray);
  }, [countries]);

  if (countries.length === 0) {
    return <Spinner />;
  }

  if (gameState === "playing") {
    return (
      <div className="bg-slate-950 text-slate-200 px-20 py-10 flex flex-col justify-center text-xl items-center">
        <h1 className="text-3xl text-center pb-5 tracking-widest font-bold">
          DON'T CLICK AN IMAGE, TWICE
        </h1>
        <div className="flex flex-col tracking-widest items-center justify-center bg-red-900 px-16 rounded-xl py-2 mb-4">
          <Countdown
            ref={countdownRef}
            date={remainingTime}
            autoStart={true}
            renderer={renderer}
            controlled={false}
            onComplete={handleCountdownComplete}
            className="font-black "
          />
        </div>
        <h2 className="tracking-widest">
          SCORE: {currScore} / {countries.length}
        </h2>

        <div className="grid grid-cols-4 gap-8 pt-5  place-items-center">
          {randomCountries.map((country, index) => (
            <motion.img
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, type: "spring" }}
              className="h-[250px] rounded-2xl border-4 border-white"
              key={index}
              src={country.imageUrl}
              alt={country.imageUrl}
              onClick={(e) => {
                handleRandomizeClick(e);
                setClickedImageId(country._id);
              }}
            />
          ))}
        </div>

        {/* <button
          onClick={decreaseTime}
          className="bg-[#af1d20] p-2 text-white rounded-lg ml-2 shadow-2xl">
          Decrease Time by 3 Seconds
        </button> */}

        <QuestionsModal
          handlePlayerWin={handlePlayerWin}
          setCurrScore={setCurrScore}
          currScore={currScore}
          clickedImageId={clickedImageId}
        />
      </div>
    );
  } else if (gameState === "lost") {
    return (
      <>
        <div className="h-full grid place-items-center">
          <div className="bg-slate-950  text-slate-200 text-2xl flex flex-col justify-center items-center">
            <h1 className="text-5xl mb-8 uppercase font-bold tracking-widest text-red-500">
              Game Over
            </h1>
            <h2 className="uppercase tracking-widest">
              Your Score is {currScore} / {countries.length}
            </h2>
            <button
              className="px-7  py-3 rounded-xl hover:bg-slate-800 mt-8 tracking-widest bg-[#06D001] font-bold"
              onClick={playAgain}>
              PLAY AGAIN
            </button>
          </div>
        </div>
      </>
    );
  } else if (gameState === "won") {
    return (
      <div className="h-full grid place-items-center">
        <div className="bg-slate-950  h-4/5 text-slate-200 text-2xl flex flex-col justify-center items-center">
          <h1 className="text-6xl mb-8 tracking-widest font-bold">YOU WON</h1>
          <button
            className="px-7  py-3 rounded-xl hover:bg-slate-800 mt-8 tracking-widest bg-[#06D001] font-bold"
            onClick={playAgain}>
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }
}

export default PlayGame;
