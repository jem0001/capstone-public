import React, { useContext } from "react";
import DataContext from "../context/dataContext";

const Start = () => {
  const { startQuiz, showStart } = useContext(DataContext);
  return (
    <section
      className={`bg-[url('/src/pages/3d/quizImages/BlackBoard.png')] bg-cover text-white text-center bg-gray-800 ${
        showStart ? "block" : "hidden"
      }`}>
      <div className="container mx-auto">
        <div className="flex h-screen items-center justify-center">
          <div className="max-w-lg">
            <h1 className="font-black tracking-widest mb-4 text-[4rem]">
              QUIZ TIME
            </h1>
            <button
              onClick={startQuiz}
              className="px-4 py-2 bg-gray-100 text-gray-900 font-bold rounded">
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Start;
