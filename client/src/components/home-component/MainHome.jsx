import React from "react";

const MainHome = () => {
  return (
    <div
      id="home"
      className="w-full h-screen bg-[url('/src/assets/mainBG.png')] bg-cover bg-no-repeat grid place-items-center"
    >
      <div className="text-white flex items-center justify-center flex-col  text-center gap-3">
        <img
          src="/src/assets/logoNoName.png"
          alt=""
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
