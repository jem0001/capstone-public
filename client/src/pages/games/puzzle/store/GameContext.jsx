import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Game from "../models/Game";
import { pickRandomImage } from "../data/imageList";
import { useGlobalContext } from "../../../../context/context";
import { useGlobalSounds } from "../../../../context/sound/SoundContext";
import { useParams } from "react-router-dom";

/**
 * @typedef {Object} GameContextType
 * @property {{x: number, y: number}} size - number of columns and rows of the puzzle
 * @property {function} setSize - setter for the puzzle size
 * @property {?Game} game - instance of the Game being played
 * @property {Object[]} board - state of the puzzle board being rendered
 * @property {function} start - function to start the game
 * @property {function(number, number): null} play - function to play a piece at given column and row
 * @property {function} togglePause - pause or resume the game
 * @property {?string} puzzleImage - dynamic path to the current puzzle image
 * @property {function} pickNewImage - selects a new random image for the puzzle
 */

/**
 * State of the game
 * @type {React.Context<{play: (function(number, number): null), puzzleImage: ?string, game: ?Game, setSize: Function, size: {x: number, y: number}, start: Function, togglePause: Function, pickNewImage: Function, board: Object[]}>}
 */
export const GameContext = createContext(
  /** @type {GameContextType} */ {
    size: { x: 0, y: 0 },
    setSize: () => {},
    game: null,
    board: [],
    start: () => {},
    play: (x, y) => {},
    togglePause: () => {},
    puzzleImage: null,
    pickNewImage: () => {},
  }
);

/**
 * Game Context Provider with its state
 * @param {JSX.Element} children
 * @returns {JSX.Element}
 * @constructor
 */
export const GameContextProvider = ({ children }) => {
  const [activity, setActivity] = useState();
  const [gameStarted, setGameStarted] = useState(false);
  const { handleToggleScanner, getActivity } = useGlobalContext();
  const { id } = useParams();
  const { pauseMusic, playYouWin, playYouLose } = useGlobalSounds();

  const changeImageFlag = useRef(false);
  // question modal
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (x, y) => {
    setX(x);
    setY(y);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // countdown
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
    if (!game) return;
    handleToggleScanner();
    game.gameLost = true;
    pauseMusic("pleasant");
    playYouLose();
    closeModal();
    console.log("Countdown completed! game lost, talo", game.gameLost);

    // Perform any actions or state updates upon completion
  };

  // countdown end

  const [size, setSize] = useState(
    /** @type {{x: number, y: number}} - Number of columns and rows of the puzzle*/
    { x: 3, y: 3 }
  );

  const [imagePicked, setImagePicked] = useState(
    /** @type {string} - name of the puzzle image file selected */
    () => pickRandomImage()
  );

  const [puzzleImage, setPuzzleImage] = useState(
    /** @type {?string} - dynamic path to the puzzle image */
    null
  );

  const [game, setGame] = useState(
    /** @type {?Game} - instance of the Game */
    null
  );

  const [board, setBoard] = useState(
    /** @type {?Object[]} - state of the puzzle board being rendered */
    null
  );

  // fetch data
  useEffect(() => {
    (async () => {
      const activity = await getActivity(id);
      setActivity(activity);
      setCountdownStartTime(Date.now() + 60000 + activity.timer);
    })();
  }, []);

  // sets the dynamic path to the image used for the puzzle
  useEffect(() => {
    if (activity) {
      if (!imagePicked) return;

      setPuzzleImage(activity.imageUrl);

      console.log("changing image");
    }
  }, [imagePicked, changeImageFlag.current, activity]);

  // creates an instance of the game,
  // the dependency on the imagePicked is here to force re-render when the image changes
  useEffect(() => {
    if (activity) {
      setGame(new Game({ size }));
    }
  }, [size, imagePicked, changeImageFlag.current, activity]);

  // sets the puzzle board state, the board is what actually gets rendered by react
  useEffect(() => {
    if (activity) {
      if (!game) return;
      setBoard(game.getBoard());
    }
  }, [game, activity]);

  /**
   * Stats the game and causes re-render of the puzzle board
   * @type {(function(): void)}
   */
  const start = useCallback(() => {
    if (!game) return;
    handleStart();
    game.start();
    setBoard(game.getBoard());
  }, [game]);

  /**
   * Plays the piece of the puzzle at the given column and row and causes re-render
   * @type {(function(number, number): void)}
   */
  const play = useCallback(
    (x, y) => {
      if (!game) return;
      if (game.gameLost) {
        console.log("game lost");
        setTimeout(() => setBoard(game.getBoard()), 300);
        return;
      }

      const isWon = game.play(x, y);
      setBoard(game.getBoard());
      // re-render the board with a delay to allow a css transition
      if (isWon) {
        handleToggleScanner();
        console.log("panalo", game.gameWon);
        playYouWin();
        setTimeout(() => setBoard(game.getBoard()), 300);
      }
    },
    [game]
  );

  /**
   * Sets pause or resumes the game, and re-renders
   * @type {(function(): void)}
   */
  const togglePause = useCallback(() => {
    if (!game) return;
    handlePause();
    game.togglePause();
    setBoard(game.getBoard());
  }, [game]);

  const resume = useCallback(() => {
    if (!game) return;
    handleStart();
    game.togglePause();
    setBoard(game.getBoard());
  }, [game]);

  /**
   * Changes the image selected to a new random image
   * @type {(function(): void)}
   */
  const pickNewImage = useCallback(() => {
    handleEnd();
    setImagePicked(pickRandomImage());
    changeImageFlag.current = !changeImageFlag.current;
  }, []);

  return (
    <GameContext.Provider
      value={
        /** @type {GameContextType} */ {
          size,
          setSize,
          game,
          board,
          start,
          play,
          togglePause,
          resume,
          puzzleImage,
          pickNewImage,
          countdownRef,
          handleStart,
          handlePause,
          handleEnd,
          handleCountdownComplete,
          countdownStartTime,
          setCountdownStartTime,
          navigateFlag,
          setNavigateFlag,
          modalIsOpen,
          setModalIsOpen,
          openModal,
          closeModal,
          x,
          y,
          setX,
          setY,
          decreaseTime,
          setRemainingTime,
          remainingTime,
          activity,
          setActivity,
          gameStarted,
          setGameStarted,
        }
      }
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};
