import React from "react";
import ForgotComponent from "../components/ForgotComponent";
import loginBG from "../assets/loginBG.png";
const ForgotPassword = () => {
  return (
    <main
      className="flex items-center justify-center h-screen bg-cover"
      style={{ backgroundImage: `url(${loginBG})` }}
    >
      <div className="absolute inset-0 opacity-90 backdrop-blur-sm z-0"></div>
      <ForgotComponent />
    </main>
  );
};

export default ForgotPassword;
