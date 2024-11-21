import React from "react";
import LoginComponent from "../components/LoginComponent";
import loginBG from "../assets/loginBG.png";
const Login = () => {
  return (
    <main
      className="flex items-center justify-center h-screen bg-cover"
      style={{ backgroundImage: `url(${loginBG})` }}
    >
      <div className="absolute inset-0 opacity-90 backdrop-blur-sm z-0"></div>
      <LoginComponent />
    </main>
  );
};

export default Login;
