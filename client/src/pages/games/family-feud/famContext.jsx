import { createContext, useContext, useEffect, useRef, useState } from "react";
import startMusic from "./audio/start_game.mp3";
import { useGlobalContext } from "../../../context/context";
import { useParams } from "react-router-dom";

const FamContext = createContext();

const FamProvider = ({ children }) => {
  const { getActivity } = useGlobalContext();
  const { id } = useParams();

  const [stop, setStop] = useState(false);
  const [round, setRound] = useState(0);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const startMusicAudio = useRef(new Audio(startMusic));
  const [activity, setActivity] = useState();
  const [isWinnerGiven, setIsWinnerGiven] = useState(false);
  const [isLoserGiven, setIsLoserGiven] = useState(false);
  const [blankCount, setBlankCount] = useState(0);

  // Function to reset all states
  const resetGame = () => {
    setRound(0); // Reset the round to the first question
    setTeam1Score(0); // Reset team 1 score
    setTeam2Score(0); // Reset team 2 score
    setIsWinnerGiven(false); // Reset winner given state
    setIsLoserGiven(false); // Reset loser given state
    setStop(false); // Reset stop state
  };
  // Fetch JSON Data
  useEffect(() => {
    (async () => {
      const activity = await getActivity(id);
      setActivity(activity);
      console.log("fetched activity, ", activity);
    })();
  }, []);

  return (
    <FamContext.Provider
      value={{
        stop,
        setStop,
        round,
        setRound,
        team1Score,
        setTeam1Score,
        team2Score,
        setTeam2Score,
        startMusicAudio,
        activity,
        setActivity,
        isWinnerGiven,
        setIsWinnerGiven,
        isLoserGiven,
        setIsLoserGiven,
        resetGame,
        blankCount,
        setBlankCount,
      }}
    >
      {children}
    </FamContext.Provider>
  );
};

export const useGlobalFam = () => {
  return useContext(FamContext);
};
export default FamProvider;
