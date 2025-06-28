import moment from "moment";
import { data } from "react-router-dom";
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) {
    return "";
  }

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeperator = (num) => {
  if (num == null || isNaN(num)) {
    return "";
  }

  const [integerPart, fractionPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionPart
    ? `${formattedInteger}.${fractionPart}`
    : formattedInteger;
};

// export const prepareExpenseBarChartData=(data=[])=>{
//   const chartData=data.map((item) => ({
//     category: item?.category,
//     amount:item?.amount,
//   }));
//   return chartData;
// };
export const prepareExpenseBarChartData = (data = []) => {
  // 1. Create last 30 days as base
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = moment().subtract(29 - i, 'days').format('DD MMM');
    return { date, amount: 0 };
  });

  // 2. Sum expenses by day
  data.forEach((item) => {
    const expenseDate = moment(item.date).format('DD MMM');
    const day = last30Days.find((d) => d.date === expenseDate);
    if (day) {
      day.amount += item.amount;
    }
  });

  return last30Days;
};

export const prepareIncomeBarChartData=(data=[])=>{
  const sortedData=[...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData=sortedData.map((item) => ({
    month: moment(item?.date).format('Do MMM'),
    amount: item?.amount, 
    source: item?.source,
  }));
  return chartData; 
};

export const prepareExpenseLineChartData = (data = [])=> {
  const sortedData=[...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData=sortedData.map((item) => ({
    month: moment(item?.date).format('Do MMM'),
    amount: item?.amount, 
    category: item?.category,
  }));
  return chartData; 
};
