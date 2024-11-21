import React from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaDisplay } from "react-icons/fa6";
import { MdQrCodeScanner } from "react-icons/md";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Implementation = () => {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div>
      <div className="mt-16 text-center">
        <h1
          className="font-black text-[2rem] text-[#1E201E] "
          data-aos="fade-up">
          IMPLEMENTATION
        </h1>
        <p className="mx-32 mt-2" data-aos="fade-up"></p>
        <div className="flex text-white font-black text-[32px] items-center justify-center mt-8">
          <div
            className="bg-[#697565] w-[22rem] h-[15rem] "
            data-aos="fade-up"
            data-aos-duration="300">
            <FaChalkboardTeacher className="text-[6rem] mx-auto mt-14" />
            <h1>DISCUSS</h1>
          </div>
          <div
            className="bg-[#3C3D37] w-[22rem] h-[15rem]"
            data-aos="fade-up"
            data-aos-duration="600">
            <FaDisplay className="text-[6rem] mx-auto mt-14" />

            <h1>PLAY</h1>
          </div>
          <div
            className="bg-[#1E201E] w-[22rem] h-[15rem]"
            data-aos="fade-up"
            data-aos-duration="900">
            <MdQrCodeScanner className="text-[6rem]  mx-auto mt-14" />
            <h1>SCAN</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Implementation;
