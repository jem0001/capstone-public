import React from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import learning from "../../assets/home-images/learning.png";
import qr from "../../assets/home-images/qr.png";
import threeD from "../../assets/home-images/3d.png";
import { LazyLoadImage } from "react-lazy-load-image-component";

const VerticalCards = () => {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div>
      <div className="mt-16 text-center mx-36">
        <h1 className="font-black text-[2rem] text-[#1E201E]">MAIN FEATURES</h1>
        <div className="flex flex-col gap-8 mt-8">
          <div
            data-aos="fade-right"
            className="flex
        "
          >
            <img src={learning} alt="" className="w-[25rem]" />

            <div className="border-[#1E201E] border-4 bg-transparent flex flex-col items-center justify-center p-6 gap-4">
              <h1 className="font-black  text-[1.5rem] text-[#1E201E] tracking-widest">
                GAME-BASED LEARNING
              </h1>
              <p>
                SAYAP includes interactive games designed to reinforce Araling
                Panlipunan concepts, making the learning experience more
                engaging and fun for students.
              </p>
            </div>
          </div>
          <div
            data-aos="fade-left"
            className="flex
        "
          >
            <div className="border-[#1E201E] border-4 bg-transparent flex flex-col items-center justify-center p-6 gap-4">
              <h1 className="font-black text-[1.5rem] text-[#1E201E] tracking-widest">
                QR-BASED POINTING SYSTEM
              </h1>
              <p>
                SAYAP features a unique QR code system that allows students to
                scan their codes during activities, tracking their participation
                and awarding points instantly.
              </p>
            </div>
            <img src={qr} alt="" className="w-[25rem]" />
          </div>
          <div
            data-aos="fade-right"
            className="flex
        "
          >
            <img src={threeD} alt="" className="w-[25rem]" />
            <div className="border-[#1E201E] border-4 bg-transparent flex flex-col items-center justify-center p-6 gap-4">
              <h1 className="font-black text-[1.5rem] text-[#1E201E] tracking-widest">
                CUSTOMIZABLE CONTENTS
              </h1>
              <p>
                SAYAP enables teachers to modify and tailor the educational
                content and activities to fit specific lesson plans and cater to
                the unique needs of their students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalCards;
