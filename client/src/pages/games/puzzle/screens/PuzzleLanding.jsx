import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Piece from "../assets/images/Piece.png";

const PuzzleLanding = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[url('/src/assets/classroom.png')] bg-cover bg-no-repeat z-10 absolute h-full w-full top-0 left-0 grid place-items-center">
      <img
        src={Piece}
        className="h-80 mb-[-5rem] rounded-2xl border-4 border-white"
        alt=" wala laman"
      />

      <Button
        onClick={() => {
          navigate("game-screen");
        }}
        className="bg-[#059212] text-2xl tracking-widest">
        START GAME
      </Button>
    </div>
  );
};
export default PuzzleLanding;
