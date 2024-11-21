import React from "react";
import SignupComponent from "../components/SignupComponent";
import loginBG from "../assets/loginBG.png";
const Signup = () => {
  return (
    <main
      className="flex items-center justify-center h-screen bg-cover"
      style={{ backgroundImage: `url(${loginBG})` }}
    >
      <div className="absolute inset-0 opacity-90 backdrop-blur-sm z-0"></div>
      <SignupComponent />
    </main>
  );
};

export default Signup;
