import { Card } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/quarters_images/1.png";
import image2 from "../assets/quarters_images/2.png";
import image3 from "../assets/quarters_images/3.png";
import image4 from "../assets/quarters_images/4.png";

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

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 w-full mt-16">
      {quarters.map((quarter) => (
        <Card
          key={quarter.name}
          className="min-h-[60vh] grid place-items-center hover:scale-105 shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]"
          style={{
            backgroundImage: `url(${quarter.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => {
            navigate(`${quarter.name}`);
          }}
        />
      ))}
    </div>
  );
};

export default QuartersComponent;
