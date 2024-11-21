import React from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const AboutSystem = () => {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div className="" id="ourSystem">
      <div className="text-black mx-36 mt-16">
        <h1
          className="font-black text-[2rem] text-center mb-4 text-[#1E201E]"
          data-aos="fade-up">
          ABOUT
        </h1>
        <p
          className="mb-4 text-justify text-lg font-medium"
          data-aos="fade-right">
          SAYAP is a multimodal web learning application designed to enhance the
          teaching and learning experience in Araling Panlipunan for elementary
          students. The system integrates various educational tools, including
          interactive modules, games, quizzes, and multimedia content, to create
          an engaging and dynamic learning environment. By combining traditional
          educational methods with innovative technology, SAYAP transforms how
          students interact with complex topics, making learning more enjoyable
          and effective.
        </p>
        <p className="text-justify text-lg font-medium" data-aos="fade-left">
          SAYAP also includes a QR-based student response system to encourage
          active participation and track student progress in real-time.
          Additionally, the system allows teachers to customize content and
          monitor student performance through an intuitive dashboard, ensuring
          that the educational experience is tailored to meet the specific needs
          of each class.
        </p>
      </div>
    </div>
  );
};

export default AboutSystem;
