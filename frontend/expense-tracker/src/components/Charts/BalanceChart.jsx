import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BalanceChart = ({ debts }) => {
  if (!debts || debts.length === 0) {
    return <p className="text-gray-500">Nothing to visualize yet.</p>;
  }

  const data = {
    labels: debts.map((d) => `${d.fromName} → ${d.toName}`), // Use fromName & toName
    datasets: [
      {
        label: "Amount",
        data: debts.map((d) => d.amount),
        backgroundColor: [
          "#60a5fa", // blue
          "#34d399", // green
          "#f87171", // red
          "#fbbf24", // yellow
          "#a78bfa", // purple
          "#38bdf8", // cyan
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-sm">
      <Pie data={data} />
    </div>
  );
};

export default BalanceChart;
