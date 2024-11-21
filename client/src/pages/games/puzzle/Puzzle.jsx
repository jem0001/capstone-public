import App from "./App";
import { GameContextProvider } from "./store/GameContext";

const Puzzle = () => {
  return (
    <div className="w-screen">
      <GameContextProvider>
        <App />
      </GameContextProvider>
    </div>
  );
};
export default Puzzle;
