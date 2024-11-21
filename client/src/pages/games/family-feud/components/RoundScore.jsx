const RoundScore = (props) => {
  return (
    <>
      <h1
        className="game-font w-fit text-white text-center px-5 bg-blue-600 h-[80px] z-100 mx-auto border-[4px] border-blue-300 text-6xl grid place-items-center
      "
      >
        {props.roundScore}
      </h1>
    </>
  );
};

export default RoundScore;
