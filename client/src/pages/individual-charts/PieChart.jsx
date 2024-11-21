import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  PieController,
  Tooltip,
} from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/context";
import { useParams } from "react-router-dom";
ChartJS.register(ArcElement, PieController, Tooltip, Legend, ChartDataLabels);

const PieChart = () => {
  const { getIndividualCharts, studentFilter } = useGlobalContext();
  const { id, quarter } = useParams();
  const [filter, setFilter] = useState({ type: "" });
  const [chartData, setChartData] = useState();

  // const hartData = {
  //   labels: [
  //     "week-1",
  //     "week-2",
  //     "week-3",
  //     "week-4",
  //     "week-5",
  //     "week-6",
  //     "week-7",
  //     "week-8",
  //     "week-9",
  //     "week-10",
  //     "week-11",
  //     "week-12",
  //     "week-13",
  //     "week-14",
  //   ],
  //   datasets: [
  //     {
  //       label: "Points",
  //       data: [9, 19, 15, 25, 30, 22, 18, 20, 24, 29, 21, 17, 28, 23],
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.7)",
  //         "rgba(54, 162, 235, 0.7)",
  //         "rgba(255, 206, 86, 0.7)",
  //         "rgba(75, 192, 192, 0.7)",
  //         "rgba(153, 102, 255, 0.7)",
  //         "rgba(255, 159, 64, 0.7)",
  //         "rgba(99, 255, 132, 0.7)",
  //         "rgba(162, 54, 235, 0.7)",
  //         "rgba(206, 255, 86, 0.7)",
  //         "rgba(192, 75, 192, 0.7)",
  //         "rgba(102, 153, 255, 0.7)",
  //         "rgba(159, 255, 64, 0.7)",
  //         "rgba(132, 99, 255, 0.7)",
  //         "rgba(235, 162, 54, 0.7)",
  //       ],
  //       borderWidth: 1,
  //       borderColor: "black",
  //     },
  //   ],
  // };
  const chartOptions = {
    responsive: true,
    plugins: {
      datalabels: { color: "black" },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataset = context.dataset;
            const total = dataset.data.reduce((sum, value) => sum + value, 0);
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(2);
            return `${value}${"pts"}-(${percentage}%)`;
          },
        },
      },
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          font: {
            size: 11,
          },
          color: "blue",
          padding: 10,
          usePointStyle: true,
        },
      },
    },
  };

  const handleFilterChange = (e) =>
    setFilter({ ...filter, type: e.target.value });

  useEffect(() => {
    (async () => {
      const histories = await getIndividualCharts(
        id,
        "pie",
        studentFilter.quarter,
        filter.type
      );
      setChartData({
        labels: histories.map((history) => history._id),
        datasets: [
          {
            label: "Points",
            data: histories.map((history) => history.totalPoints),
            backgroundColor: [
              "rgba(44, 62, 80, 0.9)", // Dark Blue
              "rgba(22, 160, 133, 0.9)", // Dark Turquoise
              "rgba(39, 174, 96, 0.9)", // Dark Green
              "rgba(192, 57, 43, 0.9)", // Dark Red
              "rgba(142, 68, 173, 0.9)", // Dark Purple
              "rgba(41, 128, 185, 0.9)", // Dark Sky Blue
              "rgba(127, 140, 141, 0.9)", // Dark Gray
              "rgba(231, 76, 60, 0.9)", // Dark Salmon
              "rgba(46, 204, 113, 0.9)", // Dark Mint
              "rgba(52, 73, 94, 0.9)", // Dark Navy
              "rgba(33, 97, 140, 0.9)", // Dark Ocean Blue
              "rgba(136, 78, 160, 0.9)", // Dark Violet
              "rgba(205, 97, 85, 0.9)", // Dark Rose
              "rgba(126, 81, 9, 0.9)", // Dark Brown
              "rgba(28, 40, 51, 0.9)", // Dark Slate
              "rgba(58, 83, 155, 0.9)", // Dark Royal Blue
              "rgba(125, 102, 8, 0.9)", // Dark Goldenrod
              "rgba(118, 68, 138, 0.9)", // Dark Orchid
              "rgba(77, 19, 209, 0.9)", // Dark Indigo
              "rgba(0, 0, 0, 0.9)", // Almost Black
            ],
            borderWidth: 1,
          },
        ],
      });
    })();
  }, [filter, studentFilter]);

  if (!chartData) {
    return <>no data</>;
  }
  return (
    <div className="relative pt-10 w-full h-[80vh] grid place-items-center">
      <Doughnut options={chartOptions} data={chartData} />
      <select
        className="absolute top-1 right-1 border-x-gray-400 border rounded-sm text-sm p-1"
        value={filter.type}
        onChange={handleFilterChange}>
        <option value="">Both</option>
        <option value="groupings">Groupings</option>
        <option value="individual">Individual</option>
      </select>
    </div>
  );
};
export default PieChart;
