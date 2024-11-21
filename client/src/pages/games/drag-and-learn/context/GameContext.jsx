import { createContext, useEffect, useRef, useState } from "react";
import data from "../utils/data";
import shuffle from "../utils/shuffleArray";
import { useGlobalContext } from "../../../../context/context";
import { useGlobalSounds } from "../../../../context/sound/SoundContext";
import { zeroPad } from "react-countdown";
import { useParams } from "react-router-dom";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { handleToggleScanner, getActivity } = useGlobalContext();
  const { stopAndResetMusic, playYouLose, playYouWin } = useGlobalSounds();
  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [startMatch, setStartMatch] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);

  const [playerWon, setPlayerWon] = useState(false);

  const [matchSilhouettesColumns, setMatchSilhouettesColumns] = useState([]);
  const [matchDraggableFlags, setMatchDraggableFlags] = useState([
    { id: "placeholder" },
  ]);

  const [title, setTitle] = useState("");

  const [guessedCountriesCounter, setGuessedCountriesCounter] = useState(0);
  const [failedGuessingAttempts, setFailedGuessingAttempts] = useState(0);

  const [error, setError] = useState(null);

  // COUNTDOWN
  const countdownRef = useRef();

  const [navigateFlag, setNavigateFlag] = useState(false);

  // fix navigate/timer bug
  const [countdownStartTime, setCountdownStartTime] = useState(Date.now());

  //minus 3 seconds
  const [remainingTime, setRemainingTime] = useState(countdownStartTime);

  const decreaseTime = () => {
    setRemainingTime((prevTime) => prevTime - 3000);
  };

  const handleStart = () => {
    countdownRef.current.start();
  };

  const handlePause = () => {
    countdownRef.current.pause();
  };

  const handleEnd = () => {
    countdownRef.current.stop();
  };
  const handleCountdownComplete = () => {
    // if (!game) return;
    handleToggleScanner();
    setMatchEnded(true);
    setPlayerWon(false);
    stopAndResetMusic("pleasant");
    playYouLose();
    console.log("Countdown completed! game lost, talo");

    // Perform any actions or state updates upon completion
  };
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Time's up!</span>;
    } else {
      return (
        <span>
          {hours > 0 && `${zeroPad(hours)}:`}
          {zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      );
    }
  };
  // COUNTDOWN END

  // To start the game
  const setMatch = () => {
    const { title, questions } = activity;

    let silhouettes = [],
      flags = [];

    questions.forEach((country) => {
      silhouettes.push({
        id: country._id,
        name: country.name,
        imageUrl: country.imageUrl,
        flag: [],
      });

      flags.push({ id: country._id, name: country.name });
    });

    silhouettes = shuffle(silhouettes);
    flags = shuffle(flags);

    setMatchSilhouettesColumns(silhouettes);
    setMatchDraggableFlags(flags);
    setTitle(title);

    setPlayerWon(false);
    setMatchEnded(false);

    setGuessedCountriesCounter(0);
    setFailedGuessingAttempts(0);
  };

  useEffect(() => {
    (async () => {
      const activity = await getActivity(id);
      setActivity(activity);
    })();
  }, []);

  useEffect(() => {
    if (startMatch) {
      setMatch();
    }
  }, [startMatch]);

  // handle matchEnd and flags exhaustion
  useEffect(() => {
    if (matchDraggableFlags.length === 0) {
      handleToggleScanner();
      setMatchEnded(true);
      setPlayerWon(true);
      stopAndResetMusic("pleasant");
      playYouWin();
    }
  }, [matchDraggableFlags]);

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 4000);
  }, [error]);

  const handleOnDragEnd = (result) => {
    console.log(result);
    const { source, destination, draggableId } = result;

    if (!source) {
      return;
    }
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      return;
    }

    if (draggableId === destination.droppableId) {
      const newFlags = [...matchDraggableFlags];
      const newColumns = [...matchSilhouettesColumns];
      const [removed] = newFlags.splice(source.index, 1);
      const columnId = newColumns.findIndex(
        (col) => col.id === destination.droppableId
      );
      //console.log(columnId)

      const currentColumn = newColumns[columnId];
      currentColumn.flag.push(removed);

      setMatchDraggableFlags(newFlags);
      setMatchSilhouettesColumns(newColumns);
      setGuessedCountriesCounter(guessedCountriesCounter + 1);
    }

    if (draggableId !== destination.droppableId) {
      const atLeastOneColumnHasFlag = matchSilhouettesColumns.some(
        (column) => column.flag.length === 1
      );

      if (atLeastOneColumnHasFlag) {
        //console.log("yes")
        const newFlags = [...matchDraggableFlags];
        const newColumns = [...matchSilhouettesColumns];
        const columnWithFlag = newColumns.find(
          (column) => column.flag.length === 1
        );
        //console.log(columnWithFlag)
        const [removed] = columnWithFlag.flag.splice(0, 1);
        //console.log(columnWithFlag)
        //console.log(newColumns)
        setMatchSilhouettesColumns(newColumns);
        setMatchDraggableFlags([...newFlags, removed]);

        setGuessedCountriesCounter(guessedCountriesCounter - 1);
        setFailedGuessingAttempts(failedGuessingAttempts + 1);

        setError("WRONG GUESS");
      } else {
        setError("WRONG GUESS");
      }
    }
  };

  return (
    <>
      <GameContext.Provider
        value={{
          startMatch,
          setMatch,
          setStartMatch,
          matchEnded,
          playerWon,
          matchSilhouettesColumns,
          matchDraggableFlags,
          title,
          handleOnDragEnd,
          guessedCountriesCounter,
          failedGuessingAttempts,
          error,
          setError,
          countdownRef,
          navigateFlag,
          setNavigateFlag,
          countdownStartTime,
          setCountdownStartTime,
          remainingTime,
          setRemainingTime,
          decreaseTime,
          handlePause,
          handleStart,
          handleEnd,
          handleCountdownComplete,
          renderer,
          activity,
          setActivity,
        }}>
        {children}
      </GameContext.Provider>
    </>
  );
};
