import React from "react";
import AboutSystem from "../components/home-component/AboutSystem";
import MainHome from "../components/home-component/MainHome";
import Implementation from "../components/home-component/Implementation";
import SliderPart from "../components/home-component/SliderPart";
import MeetAran from "../components/home-component/MeetAran";
import VerticalCards from "../components/home-component/VerticalCards";
import HomeFooter from "../components/home-component/HomeFooter";

const HomeComponent = () => {
  return (
    <>
      <MainHome />
      <AboutSystem />
      <Implementation />
      <SliderPart />
      <MeetAran />
      <VerticalCards />
      <HomeFooter />
    </>
  );
};

export default HomeComponent;
