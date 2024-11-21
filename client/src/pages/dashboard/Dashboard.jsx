import {
  Card,
  Option,
  Select,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import BarChartSectionPoints from "./BarChartSectionPoints";
import BarChartStudentPoints from "./BarChartStudentPoints";
import MostActive from "./MostActive";
import { useGlobalContext } from "../../context/context";
import LeastActive from "./LeastActive";
import AsyncSelect from "../../utils/AsyncSelect";

const Dashboard = () => {
  const { dashboardFilter, setDashboardFilter, getAllStudents } =
    useGlobalContext();
  const [sections, setSections] = useState([]);
  const [batches, setBatches] = useState([]);
  const [studentCount, setStudentCount] = useState();
  // set up initial batch,
  useEffect(() => {
    (async () => {
      const { students, totalPages } = await getAllStudents({ limit: 0 });

      let distinctBatch = new Set(students.map((student) => student.batch));
      distinctBatch = [...distinctBatch].sort();
      setBatches(distinctBatch);
      setDashboardFilter({
        ...dashboardFilter,
        batch: distinctBatch[distinctBatch.length - 1],
      });
    })();
  }, []);

  // set up initial section,
  useEffect(() => {
    if (!dashboardFilter.batch) return;
    (async () => {
      const { students, totalPages } = await getAllStudents({
        limit: 0,
        batch: dashboardFilter.batch,
      });

      let distinctSection = new Set(students.map((student) => student.section));
      distinctSection = [...distinctSection].sort();

      console.log("dfasi", dashboardFilter);
      setDashboardFilter({
        ...dashboardFilter,
        section: distinctSection[0],
      });
      setSections(distinctSection);
    })();
  }, [dashboardFilter.batch]);

  // For studentCount
  useEffect(() => {
    if (!dashboardFilter.section) return;
    (async () => {
      const { nbHits } = await getAllStudents({
        batch: dashboardFilter.batch,
        section: dashboardFilter.section,
      });
      setStudentCount(nbHits);
    })();
  }, [dashboardFilter]);

  if (batches.length === 0 || sections.length === 0) {
    return <div> No data was found...</div>;
  }
  return (
    <div className="w-full h-full bg-gradient-to-t from-gray-900 to-slate-50 p-16">
      <div
        className="bg-white container mx-auto grid place-items-center content-center p-8 shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]
 border-[#697565] border-[6px] rounded-xl">
        <div className="grid w-full grid-cols-1 lg:grid-cols-4 gap-4">
          <Typography
            variant="h3"
            color="blue-gray"
            className="text-center col-span-4 py-6">
            Main Dashboard
          </Typography>
          <div className="flex justify-between col-span-4 gap-8 top-4 z-10 ">
            <Select
              label="Batch"
              value={dashboardFilter.batch}
              onChange={(val) => {
                setDashboardFilter({ ...dashboardFilter, batch: val });
              }}>
              {batches.map((batch) => (
                <Option key={batch} value={batch}>
                  {batch}
                </Option>
              ))}
            </Select>
            <Select
              label="Quarter"
              value={dashboardFilter.quarter}
              onChange={(val) => {
                setDashboardFilter({ ...dashboardFilter, quarter: val });
              }}>
              <Option value="">All Quarters</Option>
              <Option value="quarter-1">Quarter 1</Option>
              <Option value="quarter-2">Quarter 2</Option>
              <Option value="quarter-3">Quarter 3</Option>
              <Option value="quarter-4">Quarter 4</Option>
            </Select>
            <AsyncSelect
              label="Section"
              value={dashboardFilter.section}
              onChange={(val) => {
                setDashboardFilter({ ...dashboardFilter, section: val });
              }}>
              {sections.map((section) => (
                <Option key={section} value={section}>
                  {section}
                </Option>
              ))}
            </AsyncSelect>
          </div>

          <Card className="lg:col-span-3 border-[#3C3D37] border-4">
            <div className="w-full bg-[#3C3D37] rounded-t-md grid items-center p-2">
              <Typography variant="h6" color="white" className="text-center">
                Bar Chart Sections Points
              </Typography>
            </div>
            <BarChartSectionPoints />
          </Card>
          <Card className="lg:col-span-1 border-4 border-black text-black  ">
            {/* <div className="flex w-full h-full flex-col gap-2">
              <div className="bg-blue-500 w-full h-full flex items-center justify-center flex-co rounded-md">
                <Typography variant="h6" color="white" className="text-center">
                  Number of Students
                </Typography>
                <p className="text-3xl">{studentCount}</p>
              </div>
            </div> */}
            <div className="w-full bg-black rounded-t-md grid items-center p-2">
              <Typography variant="h6" color="white" className="text-center">
                Number of Students
              </Typography>
            </div>
            <div>
              <p className="text-black text-[7rem] font-bold flex items-center justify-center mt-8">
                {studentCount}
              </p>
            </div>
          </Card>
          <Card className="lg:col-span-2 border-[#00712D] border-4">
            <div className="w-full bg-[#00712D] rounded-t-md grid items-center p-2">
              <Typography variant="h6" color="white" className="text-center">
                Most Active
              </Typography>
            </div>
            <MostActive />
          </Card>
          <Card className="lg:col-span-2 border-[#800000] border-4">
            <div className="w-full bg-[#800000] rounded-t-md grid items-center p-2">
              <Typography variant="h6" color="white" className="text-center">
                Least Active
              </Typography>
            </div>
            <LeastActive />
          </Card>
          <Card className="lg:col-span-4 border-[#3C3D37] border-4">
            <div className="w-full bg-[#3C3D37] rounded-t-md grid items-center p-2">
              <Typography variant="h6" color="white" className="text-center">
                Bar Chart Students Points
              </Typography>
            </div>
            <BarChartStudentPoints />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
