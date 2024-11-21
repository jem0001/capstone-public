import { Outlet } from "react-router-dom";
import { useGlobalFam } from "./famContext";
import "./App.css";
import { Tooltip, Typography } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

const App = () => {
  const { round } = useGlobalFam();

  return (
    <div className="w-full h-screen">
      <Outlet />
      <div className="absolute top-2 right-2">
        <Tooltip
          placement="bottom"
          className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
          content={
            <div className="w-96">
              <div>
                <h1 className="text-blue-900 text-center tracking-widest font-bold">
                  BUTTONS TO CLICK
                </h1>
                <hr className="w-full bg-black h-[1.5px] " />
                <ul className="flex flex-col gap-2">
                  <li className="text-black mt-2">
                    To give strike during the faceoff,
                    <span className="uppercase text-blue-900 font-semibold">
                      {" "}
                      press Shift + x
                    </span>
                  </li>
                  <li className="text-black">
                    To give a strike once faceoff is over,{" "}
                    <span className="uppercase text-blue-900 font-semibold">
                      press x.
                    </span>
                  </li>
                  <li className="text-black">
                    To add points to team 1,{" "}
                    <span className="uppercase text-blue-900 font-semibold">
                      press 1
                    </span>
                  </li>
                  <li className="text-black">
                    To add points to team 2,{" "}
                    <span className="uppercase text-blue-900 font-semibold">
                      press 2
                    </span>
                  </li>
                  <li className="text-black">
                    <span className="uppercase text-blue-900 font-semibold">
                      Press →{" "}
                    </span>{" "}
                    to head to scoreboard after round finishes
                  </li>
                </ul>
              </div>
            </div>
          }>
          <InformationCircleIcon className="size-7 text-gray-400" />
        </Tooltip>
      </div>
    </div>
  );
};
export default App;
