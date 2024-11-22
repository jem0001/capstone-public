import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  PieController,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/context";
import { useParams } from "react-router-dom";
import axios from "axios";

ChartJS.register(ArcElement, PieController, Tooltip, Legend, ChartDataLabels);

const LoseWinRatio = () => {
  const { id } = useParams();
  const { studentFilter } = useGlobalContext();
  const [chartData, setChartData] = useState();

  const chartOptions = {
    responsive: true,
    plugins: {
      datalabels: { display: false },
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
        position: "right",
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

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `/histories?studentId=${id}&quarter=${studentFilter.quarter}`
      );
      console.log("winlose reatioooo", response.data.histories);
      const histories = response.data.histories;

      const yAxis = { win: 0, lose: 0 };

      histories.reduce((accumulator, history) => {
        if (history.status === "won") {
          accumulator.win += history.pointsAdded;
        }
        if (history.status === "lost") {
          accumulator.lose += history.pointsAdded;
        }
        return accumulator;
      }, yAxis);

      console.log(yAxis, "yyyyy");

      setChartData({
        labels: [" WIN", " LOSE"],
        datasets: [
          {
            label: "Points",
            data: Object.values(yAxis),
            backgroundColor: ["green", "red"],
            borderWidth: 1,
            borderColor: "white",
            cutout: "60%",
            borderRadius: 1,
          },
        ],
      });
    })();
  }, [studentFilter]);

  if (!chartData) {
    return <>no data</>;
  }
  return <Doughnut options={chartOptions} data={chartData} />;
};
export default LoseWinRatio;
