import React from "react";
import Logo from "../image/logoNoName.png";

export const Card = ({ card, handleCardClick }) => {
  return (
    <div
      className={`relative cursor-pointer h-20 w-20 rounded-xl transition-transform duration-700 md:h-40 md:w-40 ${
        card.flipped
          ? "bg-white border-4 border-black"
          : "bg-white border-4 border-black"
      }`}
      onClick={() => handleCardClick(card._id)}
      style={{
        transformStyle: "preserve-3d",
        transform: card.flipped ? "rotateY(0deg)" : "rotateY(180deg)",
        transition: "transform 0.7s ease-in-out, bg-[#f2e4d2] 0.3s",
      }}>
      {/* Front face (image side) */}
      <div
        className={`absolute w-full h-full flex justify-center items-center rounded-xl ${
          card.flipped ? "" : "invisible"
        }`}
        style={{
          backfaceVisibility: "hidden",
        }}>
        <img src={card.imageUrl} className="h-[80%] w-[80%] object-fill" />
      </div>

      {/* Back face (image before flipping) */}
      <div
        className={`absolute w-full h-full flex justify-center items-center rounded-xl border-black border-4 bg-blue-900 ${
          card.flipped ? "invisible" : ""
        }`}
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}>
        <img src={Logo} className="h-[60%] w-[60%] object-fill rounded-full" />
      </div>
    </div>
  );
};
