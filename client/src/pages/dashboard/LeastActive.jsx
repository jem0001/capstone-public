import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/context";

const TABLE_HEAD = ["Name", "Points"];

const LeastActive = () => {
  const { dashboardFilter } = useGlobalContext();
  const [rows, setRows] = useState([]);

  const getMostActive = async () => {
    const response = await axios.get(
      `/students?batch=${dashboardFilter.batch}&section=${dashboardFilter.section}&quarter=${dashboardFilter.quarter}`
    );
    const students = response.data.students;

    // Step 1: Aggregate total points by studentId
    const pointsMap = students.reduce((acc, student) => {
      const totalPoints =
        (student.individualPoints || 0) + (student.groupingsPoints || 0);
      if (acc[student.studentId]) {
        acc[student.studentId].points += totalPoints;
      } else {
        acc[student.studentId] = {
          _id: student._id,
          studentId: student.studentId,
          name: student.fullName,
          points: totalPoints,
        };
      }
      return acc;
    }, {});

    // Convert pointsMap to an array and sort by points
    const studentsWithTotalPoints = Object.values(pointsMap);
    studentsWithTotalPoints.sort((a, b) => a.points - b.points);

    // Get the top five students
    const topFive = studentsWithTotalPoints.slice(0, 5);

    setRows(topFive);
  };

  useEffect(() => {
    getMostActive();
  }, [dashboardFilter]);

  return (
    <div className="p-4">
      {rows.length > 0 && (
        <Card className="h-full w-full overflow-hidden">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ _id, studentId, name, points }, index) => {
                const isLast = index === rows.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {points}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};
export default LeastActive;
