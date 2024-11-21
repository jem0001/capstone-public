import React from "react";
import AboutSystem from "../components/home-component/AboutSystem";
import MainHome from "../components/home-component/MainHome";
import Implementation from "../components/home-component/Implementation";
import SliderPart from "../components/home-component/SliderPart";
import VerticalCards from "../components/home-component/VerticalCards";

const HomeComponent = () => {
  return (
    <>
      <MainHome />
      <AboutSystem />
      <Implementation />
      <SliderPart />
      <VerticalCards />
    </>
  );
};

export default HomeComponent;
