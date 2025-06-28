import React from 'react';
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Income", amount: totalIncome },
    { name: "Total Expense", amount: totalExpense }
  ];

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold text-base-content">Financial Overview</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        colors={COLORS}
        label="Total Balance"
        totalAmount={`₹${totalBalance}`}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
