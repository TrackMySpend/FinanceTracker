import React from "react";

const BalanceTable = ({ debts }) => {
  if (!debts || debts.length === 0) {
    return <p className="mt-4 text-gray-500">No outstanding balances.</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 font-medium text-gray-700 border-b">From</th>
            <th className="px-4 py-2 font-medium text-gray-700 border-b">To</th>
            <th className="px-4 py-2 font-medium text-gray-700 border-b">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((debt, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{debt.from}</td>
              <td className="px-4 py-2 border-b">{debt.to}</td>
              <td className="px-4 py-2 border-b text-green-600 font-medium">
                ₹{debt.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BalanceTable;
