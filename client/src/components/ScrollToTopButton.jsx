import { useEffect, useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-10 right-10">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-[black] font-bold text-white p-4 rounded-full shadow-lg hover:bg-[#3C3D37] transition duration-300">
          <ChevronUpIcon className="h-8 w-8 font-black" />
        </button>
      )}
    </div>
  );
}

export default ScrollToTopButton;
