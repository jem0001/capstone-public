import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/context";
import { useParams } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const chartOptions = {
  plugins: {
    datalabels: { display: false },
    legend: { display: false },
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
      // ticks: {
      //   autoSkip: true, // Automatically skip labels to avoid overlap
      //   maxTicksLimit: 5, // Maximum number of ticks and labels to show
      //   // callback: function (value, index, values) {
      //   //   // Custom callback to display the label values if necessary
      //   //   return value; // or return some formatting of value if needed
      //   // },
      // },
    },
  },
};

const BarChart = () => {
  const { getIndividualCharts, studentFilter } = useGlobalContext();
  const { id } = useParams();
  const [chartData, setChartData] = useState();
  const [dateFilter, setDateFilter] = useState("thisWeek");

  useEffect(() => {
    (async () => {
      const histories = await getIndividualCharts(
        id,
        "bar",
        studentFilter.quarter,
        "",
        dateFilter
      );
      console.log(histories);
      setChartData({
        labels: Object.keys(histories),
        datasets: [
          {
            label: "",
            data: Object.values(histories),
            backgroundColor: "#03346E",
          },
        ],
      });
    })();
  }, [dateFilter, studentFilter]);

  if (!chartData) {
    return <>No data</>;
  }
  return (
    <div className="relative pt-16 w-full h-[65vh] grid place-items-center">
      <Bar options={chartOptions} data={chartData} />
      <select
        className="absolute top-1 right-1 border-x-gray-400 border rounded-sm text-sm p-1"
        value={dateFilter}
        onChange={(e) => {
          setDateFilter(e.target.value);
        }}
      >
        <option value="thisWeek">This week</option>
        <option value="lastWeek">Last week</option>
        <option value="thisMonth">This Month</option>
        <option value="lastMonth">Last Month</option>
        <option value="twoMonthsAgo">2 months ago</option>
        <option value="thisYear">All months</option>
      </select>
    </div>
  );
};
export default BarChart;
