import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useGlobalContext } from "../../context/context";
import { useEffect, useState } from "react";
import { Spinner } from "@material-tailwind/react";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const BarChartStudentPoints = () => {
  const { getDashboardCharts, dashboardFilter } = useGlobalContext();
  const [chartData, setChartData] = useState();
  const [dateFilter, setDateFilter] = useState("");

  const colors = [
    { borderColor: "green", backgroundColor: "rgba(0,128,0,0.2)" },
    { borderColor: "red", backgroundColor: "rgba(128,0,0,0.2)" },
    { borderColor: "blue", backgroundColor: "rgba(0,0,128,0.2)" },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: true,
    },
    plugins: {
      datalabels: { display: false },
      legend: { display: false }, // Set to true to show the legend
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `${value}${"pts"}`;
          },
        },
      },
    },
    scales: {
      x: {
        // Uncomment and customize ticks if needed
        // ticks: {
        //   autoSkip: true,
        //   maxTicksLimit: 5,
        // },
      },
    },
  };

  useEffect(() => {
    (async () => {
      const charts = await getDashboardCharts(
        "barStudents",
        dashboardFilter.batch,
        dashboardFilter.section,
        dashboardFilter.quarter
      );
      setChartData({
        labels: charts.names,
        datasets: [
          {
            data: charts.data,
            borderWidth: 2,
            borderColor: "rgba(0,0,0,.7)",
            backgroundColor: "rgba(0,0,0,.7)",
          },
        ],
      });
    })();
  }, [dashboardFilter]);

  if (!chartData) {
    return (
      <div>
        <Spinner />;
      </div>
    );
  }
  return (
    <div className="relative  h-[40vh] pt-8 ">
      <Bar options={chartOptions} data={chartData} />
      {/* <select
        className="absolute top-1 right-1 border-x-gray-400 border rounded-sm text-sm p-1"
        value={""}
        onChange={(e) => {
          setDateFilter(e.target.value);
        }}
      >
        <option value="">All dates</option>
        <option value="today">Today</option>
        <option value="thisWeek">This week</option>
        <option value="thisMonth">This month</option>
      </select> */}
    </div>
  );
};

export default BarChartStudentPoints;
