import React, { useEffect, useState } from 'react';
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const formatted = data?.map((item) => ({
      name: item?.source,
      amount: item?.amount,
    }));
    setChartData(formatted);
  }, [data]);

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold text-base-content">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`₹${totalIncome}`}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
