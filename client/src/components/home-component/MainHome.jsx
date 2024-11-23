import React from "react";
import logoNoName from "../../assets/logoNoName.png";
import mainBG from "../../assets/mainBG.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const MainHome = () => {
  return (
    <div
      id="home"
      className={`w-full h-screen bg-cover bg-no-repeat grid place-items-center`}
      style={{
        backgroundImage: `url(${mainBG})`,
      }}
    >
      <div className="text-white flex items-center justify-center flex-col  text-center gap-3">
        <LazyLoadImage
          alt="logo"
          src={logoNoName} // use normal <img> attributes as props
          effect="blur"
          className="w-72 h-72 rounded-full"
        />

        <h1 className="font-black text-[3rem]">
          <span className="text-transparent">S A Y</span> A P
        </h1>

        <p className="font-semibold text-[1.2rem]">
          A Multimodal Web Learning Application For Araling Panlipunan With
          QR-Based Student Response
        </p>
      </div>
    </div>
  );
};

export default MainHome;
