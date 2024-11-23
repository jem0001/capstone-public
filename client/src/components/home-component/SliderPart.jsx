import React from "react";
import { Carousel } from "@material-tailwind/react";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Clash from "../../assets/GamesBG/Clash.png";
import Hang from "../../assets/GamesBG/Detectives.png";
import Drag from "../../assets/GamesBG/Drag.png";
import Explore from "../../assets/GamesBG/Explore.png";
import Easy from "../../assets/GamesBG/MemoryEasy.png";
import Hard from "../../assets/GamesBG/MemoryHard.png";
import Pair from "../../assets/GamesBG/Pair.png";
import Piece from "../../assets/GamesBG/Piece.png";

const SliderPart = () => {
  useEffect(() => {
    Aos.init();
  }, []);

  const bgImages = [Clash, Hang, Drag, Explore, Easy, Hard, Pair, Piece];

  return (
    <div className="mt-16 text-center ">
      <h1 className="font-black text-[2rem] text-[#1E201E]" data-aos="fade-up">
        LIST OF GAMES
      </h1>
      <div className="mx-40 mt-8 h-[30rem]" data-aos="flip-up">
        <Carousel className="">
          {bgImages.map((image) => (
            <img
              key={image.index}
              src={image}
              alt="image 2"
              className="h-full w-full object-cover"
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default SliderPart;
