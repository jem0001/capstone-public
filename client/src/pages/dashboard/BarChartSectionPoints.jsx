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

const BarChartSectionPoints = () => {
  const { getDashboardCharts, dashboardFilter } = useGlobalContext();
  const [chartData, setChartData] = useState();
  const colors = [
    { borderColor: "#EC8E01", backgroundColor: "#EC8E01" },
    { borderColor: "#FF2E31", backgroundColor: "#FF2E31" },
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
      legend: { display: true }, // Set to true to show the legend
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `${context.dataset.label}: ${value}${"pts"}`;
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

  // const chartData = {
  //   labels: [
  //     "Jan-3",
  //     //   "Jan-10",
  //     //   "Jan-17",
  //     //   "Jan-25",
  //     //   "Feb-2",
  //     //   "Feb-8",
  //     //   "Feb-14",
  //     //   "Feb-21",
  //     //   "Feb-27",
  //     //   "Feb-29",
  //     //   "May-29",
  //     //   "Jun-29",
  //     //   "Jul-29",
  //     //   "Aug-29",
  //   ], // Hard-coded dates spanning from January to February
  //   datasets: [
  //     {
  //       label: "Section 3",
  //       data: Array.from(
  //         { length: 14 },
  //         () => Math.floor(Math.random() * 10) + 1
  //       ),
  //       borderWidth: 2, // Bar border width
  //       borderColor: "green",
  //       backgroundColor: "rgba(0,128,0,0.2)", // Light green fill
  //     },
  //     {
  //       label: "Section 1",
  //       data: [3, 4, 5, 3, 7, 0, 0, 2, 6],
  //       borderWidth: 2, // Bar border width
  //       borderColor: "red",
  //       backgroundColor: "rgba(255,0,0,0.2)", // Light red fill
  //     },
  //     {
  //       label: "Section 2",
  //       data: [2, 3, 6, 1, 6, 2, 5, 6, 3],
  //       borderWidth: 2, // Bar border width
  //       borderColor: "blue",
  //       backgroundColor: "rgba(0,0,255,0.2)", // Light blue fill
  //     },
  //   ],
  // };

  useEffect(() => {
    (async () => {
      const charts = await getDashboardCharts(
        "barSections",
        dashboardFilter.batch,
        undefined,
        dashboardFilter.quarter
      );
      setChartData({
        labels: charts.labels.map((label) => label),

        datasets: charts.sections.map((section, index) => ({
          label: `Section-${section}`,
          data: charts.data[index],
          borderWidth: 2,
          borderColor: colors[index].borderColor,
          backgroundColor: colors[index].backgroundColor,
        })),
      });
    })();
  }, [dashboardFilter]);

  if (!chartData) {
    return <Spinner />;
  }
  return (
    <div className="relative  h-[40vh]">
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
};

export default BarChartSectionPoints;
