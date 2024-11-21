const TeamScore = (props) => {
  const isTeam1 = props.teamContainerClass === "team-1";
  const teamScore = isTeam1 ? props.team1Score : props.team2Score;

  return (
    <div
      className={`flex items-center justify-center p-4 ${props.teamContainerClass} `}
    >
      <h1 className="text-4xl font-bold text-white">{teamScore}</h1>
    </div>
  );
};

export default TeamScore;
