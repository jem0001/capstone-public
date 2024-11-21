import React from "react";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const HomeFooter = () => {
  return (
    <div className="bg-[url('/src/components/home-images/sfisBG.png')] w-full h-[5rem] text-white flex items-center justify-center gap-12 mt-12">
      <div>
        <h1 className="font-normal">© 2024 Sta.Filomena Integrated School</h1>
      </div>
      <div className="text-[1.5rem] flex gap-4">
        <FaFacebookSquare />
        <FaInstagramSquare />
        <FaSquareXTwitter />
      </div>
    </div>
  );
};

export default HomeFooter;
