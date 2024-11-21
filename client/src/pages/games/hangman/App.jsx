import { useCallback, useEffect, useState } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import words from "./wordList.json";
import { Button, Spinner } from "@material-tailwind/react";
import { useGlobalSounds } from "../../../context/sound/SoundContext";
import { useGlobalContext } from "../../../context/context";
import { useParams } from "react-router-dom";
import QrReaderComponent from "../../../components/qr-scanner/QrReaderComponent";
import Hang from "../../../assets/GamesBG/Detectives.png";

function App() {
  const { getActivity, handleToggleScanner } = useGlobalContext();
  const {
    playMusic,
    stopAndResetMusic,
    playYouWin,
    playYouLose,
    playCorrect,
    playWrong,
    areEffectsMuted,
    isMusicMuted,
    isMusicPlaying,
  } = useGlobalSounds();
  const { id } = useParams();

  const [activity, setActivity] = useState();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wordToGuess, setWordToGuess] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess.split("").every((letter) => {
    return letter === " " || guessedLetters.includes(letter);
  });

  const addGuessedLetter = useCallback(
    (letter) => {
      if (guessedLetters.includes(letter) || isWinner || isLoser) return;

      if (wordToGuess.includes(letter)) {
        if (!areEffectsMuted) playCorrect(); // Check mute state here
      } else {
        if (!areEffectsMuted) playWrong(); // Check mute state here
      }

      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser, wordToGuess, areEffectsMuted]
  );

  // Function to reset the game
  const nextWord = () => {
    setGuessedLetters([]);
    setWordToGuess(questions[currentIndex + 1].correctAnswer);
    setCurrentIndex(currentIndex + 1);
  };

  const resetGame = () => {
    setIsGameStarted(false);
    setGuessedLetters([]);
    setWordToGuess(questions[0].correctAnswer);
    setCurrentIndex(0);
  };

  const handleGameEnd = () => {
    if (isWinner && wordToGuess !== "") {
      handleToggleScanner();
      playYouWin();
      if (currentIndex === questions.length - 1) {
        stopAndResetMusic("pleasant");
      }
      console.log("Congratulations! You won!"); // Add any additional event here
    }
    if (isLoser) {
      handleToggleScanner();
      playYouLose();
      if (currentIndex === questions.length - 1) {
        stopAndResetMusic("pleasant");
      }
      console.log("Sorry, you lost!"); // Add any additional event here
    }
  };

  useEffect(() => {
    console.log("fetch data from backend");
    (async () => {
      const activity = await getActivity(id);
      setActivity(activity);
      setQuestions(activity.questions);
      setWordToGuess(activity.questions[currentIndex].correctAnswer);
    })();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };
    console.log("keyboard can be clicked");

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters, activity]);

  useEffect(() => {
    handleGameEnd(); // Check for game end status
  }, [isWinner, isLoser]); // Re-run when isWinner or isLoser changes

  if (!wordToGuess) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  console.log("currentindex", currentIndex);

  if (!isGameStarted) {
    return (
      <div className="h-screen grid place-items-center bg-[url('/src/assets/classroom.png')] bg-cover bg-no-repeat">
        <img
          src={Hang}
          alt=""
          className="h-80 rounded-2xl border-4 border-white mb-[-8rem]"
        />
        <Button
          className="bg-[#059212] px-16 py-4 rounded-2xl text-2xl tracking-widest uppercase text-white font-bold"
          onClick={() => {
            setIsGameStarted(true);
            if (!isMusicPlaying && !isMusicMuted) {
              console.log("layout");
              playMusic("pleasant");
            }
          }}>
          START GAME
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center py-6 px-16 bg-[url('/src/assets/desert.jpg')] bg-cover bg-no-repeat">
      {/* QUESTIONS FOR THE HANGMAN */}
      <div className="tracking-widest uppercase font-bold text-lg bg-brown-900 py-6 px-4 rounded-2xl text-white text-center">
        <div>
          <h1 className="text-yellow-600">QUESTION:</h1>
        </div>
        <h1>{questions[currentIndex].question}</h1>
      </div>

      <div className="max-w-3xl flex flex-col gap-8  items-center  container">
        <div className="text-4xl text-center text-green-600 select-none">
          {isWinner && (
            <>
              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={resetGame}
                  className="mt-4 p-2 bg-green-500 text-white rounded">
                  PLAY AGAIN
                </button>
              ) : (
                <button
                  onClick={nextWord}
                  className="mt-4 py-2 px-8 tracking-widest bg-green-500 text-white rounded">
                  NEXT WORD
                </button>
              )}
            </>
          )}
          {isLoser && (
            <>
              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={resetGame}
                  className="mt-4 p-2 bg-green-500 text-white rounded">
                  PLAY AGAIN
                </button>
              ) : (
                <button
                  onClick={nextWord}
                  className="mt-4 py-2 px-8 tracking-widest bg-green-500 text-white rounded">
                  NEXT WORD
                </button>
              )}
            </>
          )}
        </div>
        <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
        <HangmanWord
          reveal={isLoser}
          guessedLetters={guessedLetters}
          wordToGuess={wordToGuess}
        />
        <div className="self-stretch">
          <Keyboard
            disabled={isWinner || isLoser}
            activeLetters={guessedLetters.filter((letter) =>
              wordToGuess.includes(letter)
            )}
            inactiveLetters={incorrectLetters}
            addGuessedLetter={addGuessedLetter}
          />
        </div>
      </div>

      {isWinner && (
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
      {isLoser && (
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
    </div>
  );
}

export default App;
