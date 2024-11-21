import React from "react";
import { LiaSadCry } from "react-icons/lia";
import { MdCelebration } from "react-icons/md";

export const Modal = ({
  gameOver,
  setGameOver,
  moves,
  handleNewGame,
  message,
  won,
  matchCounter,
  activity,
}) => {
  return (
    <div
      className={`${
        gameOver ? "flex" : "hidden"
      } flex-col justify-center items-center gap-7 bg-blue-900 absolute border-8 border-black w-[400px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 rounded-2xl`}>
      <button
        className="text-white font-bold absolute right-0 top-0 mr-3 hover:text-yellow-500 text-2xl"
        onClick={() => setGameOver(false)}>
        &times;
      </button>

      <h1 className="text-white uppercase text-3xl font-bold tracking-wider">
        {message}
      </h1>

      <div className="flex justify-between gap-2 font-bold text-lg tracking-widest">
        <p className="text-white">Score:</p>
        <p className="text-white">
          {matchCounter} / {activity.questions.length}
        </p>
      </div>

      <div className="flex justify-between gap-2 font-bold text-lg tracking-widest">
        <p className="text-white">Moves:</p>
        <p className="text-white">{moves}</p>
      </div>

      <button
        className="bg-[#06D001] font-semibold text-white rounded-md px-5 py-2 hover:opacity-90"
        onClick={handleNewGame}>
        PLAY AGAIN
      </button>
    </div>
  );
};
