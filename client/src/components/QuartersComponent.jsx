import { Card } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/quarters_images/1.png";
import image2 from "../assets/quarters_images/2.png";
import image3 from "../assets/quarters_images/3.png";
import image4 from "../assets/quarters_images/4.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Blurhash } from "react-blurhash";
import { useState } from "react";

// array to object
// new with images
const quarters = [
  { name: "quarter-1", image: image1 },
  { name: "quarter-2", image: image2 },
  { name: "quarter-3", image: image3 },
  { name: "quarter-4", image: image4 },
];

const QuartersComponent = () => {
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 w-full mt-16">
      {quarters.map((quarter) => (
        <div
          key={quarter.name}
          className="overflow-hidden min-h-[60vh] rounded-xl relative hover:scale-105 shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]"
          // style={{
          //   backgroundImage: `url(${quarter.image})`,
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          // }}

          onClick={() => {
            navigate(`${quarter.name}`);
          }}
        >
          <LazyLoadImage
            key={quarter.name}
            alt="quarter"
            src={quarter.image}
            effect="blur"
            height={"100%"}
            onLoad={() => {
              setIsImageLoaded(true);
            }}
            className="w-full h-full object-cover object-center  "
          />

          {!isImageLoaded && (
            <div className="w-full h-full absolute top-0 left-0">
              <Blurhash
                hash="LEAJsBt79Gae=^bIt8t6~WW;D*WA"
                width={"100%"}
                height={"100%"}
                resolutionX={32}
                resolutionY={32}
                punch={1}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuartersComponent;
