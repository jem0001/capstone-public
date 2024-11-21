const BlankCard = () => {
  return (
    <div className="answer-card">
      <div className="front-face flex justify-center">
        <div className="flex-1 answer"></div>
        <div className="flex-1"></div>
      </div>
      <div className="back-face flex justify-center items-center">
        <div className="mx-auto my-auto"></div>
      </div>
    </div>
  );
};

export default BlankCard;
