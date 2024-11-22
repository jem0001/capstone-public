import {
  Card,
  Option,
  Select,
  Spinner,
  spinner,
  Typography,
} from "@material-tailwind/react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ProgressProvider from "../../components/ProgressProvider";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/context";
import { useParams } from "react-router-dom";
import LoseWinRatio from "./LoseWinRatio";
import axios from "axios";

const IndiCharts = () => {
  const { getOneStudent, studentFilter, setStudentFilter } = useGlobalContext();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [totalGroupActs, setTotalGroupActs] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedGroupActs, setCompletedGroupActs] = useState(0);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `/students?id=${id}&quarter=${studentFilter.quarter}`
      );
      const responseTwo = await axios.get(
        `/activities?quarter=${studentFilter.quarter}&type=groupings`
      );
      setTotalGroupActs(responseTwo.data.nbHits);

      const students = response.data.students;
      setName(students[0].fullName);
      setCompletedGroupActs(students[0].completedGroupActs);
      setTotalPoints(
        students[0].individualPoints + students[0].groupingsPoints
      );
    })();
  }, [studentFilter]);

  return (
    // bg can be added below
    <div className="w-full h-full bg-gradient-to-t from-gray-900 to-slate-50">
      <div className=" container mx-auto grid place-items-center content-center p-16 bg">
        <div
          className="bg-white grid w-full grid-cols-1 lg:grid-cols-3 gap-4 
        shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]
           p-8 rounded-lg border-[#697565] border-4"
        >
          <div className="flex justify-between col-span-3">
            <Typography variant="h4" color="blue-gray" className="">
              Points Distribution
            </Typography>
            <Typography variant="h4" color="blue-gray" className="capitalize">
              {name}
            </Typography>
            <div className="w-fit">
              <Select
                label="Quarter"
                value={studentFilter.quarter}
                onChange={(val) => {
                  setStudentFilter({ ...studentFilter, quarter: val });
                }}
              >
                <Option value="">All Quarters</Option>
                <Option value="quarter-1">Quarter 1</Option>
                <Option value="quarter-2">Quarter 2</Option>
                <Option value="quarter-3">Quarter 3</Option>
                <Option value="quarter-4">Quarter 4</Option>
              </Select>
            </div>
          </div>

          <Card className="lg:col-span-3">
            <div className="flex justify-around items-center p-4 border-[#697565] border-4 rounded-lg">
              <ProgressProvider
                valueStart={0}
                valueEnd={(completedGroupActs / totalGroupActs) * 100}
              >
                {(value) => (
                  <div className="size-40">
                    <CircularProgressbarWithChildren
                      value={value}
                      styles={buildStyles({
                        textColor: "red",
                        pathColor: "turquoise",
                        trailColor: "#003285",
                      })}
                    >
                      {`${completedGroupActs}/${totalGroupActs}`}
                    </CircularProgressbarWithChildren>
                  </div>
                )}
              </ProgressProvider>

              <div className="rounded-full size-40 bg-[#2A629A] grid place-items-center text-white">
                {totalPoints}
              </div>

              <div className="rounded-full size-[220px] grid place-items-center">
                <LoseWinRatio />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-1 border-[#3C3D37] border-4">
            <div className="w-full bg-[#3C3D37] rounded-t-md grid items-center p-2 text-center">
              <Typography variant="h6" color="white" className="">
                Weekly Points Distribution
              </Typography>
            </div>
            <PieChart />
          </Card>

          <Card className="lg:col-span-2 border-[#3C3D37] border-4">
            <div className="w-full bg-[#3C3D37] rounded-t-md grid items-center p-2 text-center">
              <Typography variant="h6" color="white" className="">
                Title Points Distribution
              </Typography>
            </div>
            <BarChart />
          </Card>
        </div>
      </div>
    </div>
  );
};
export default IndiCharts;
