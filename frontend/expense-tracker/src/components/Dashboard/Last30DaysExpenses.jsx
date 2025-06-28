import React, { useEffect, useState } from 'react';
import { prepareExpenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';

const Last30DaysExpenses = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseBarChartData(data);
    setChartData(result);
  }, [data]);

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl p-5 shadow-md col-span-1">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold text-base-content">
          Last 30 Days Expenses
        </h5>
      </div>

      <CustomBarChart data={chartData} />
    </div>
  );
};

export default Last30DaysExpenses;
