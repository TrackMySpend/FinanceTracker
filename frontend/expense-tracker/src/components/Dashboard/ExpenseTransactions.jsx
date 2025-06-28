import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="bg-base-100 border border-base-300 rounded-xl p-5 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold text-base-content">Expenses</h5>
        <button
          onClick={onSeeMore}
          className="btn btn-sm btn-ghost text-sm gap-1"
        >
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      {/* Expense List */}
      <div className="space-y-4">
        {transactions?.slice(0, 5)?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.category}
            icon={expense.icon}
            date={moment(expense.date).format('Do MMM YYYY')}
            amount={expense.amount}
            type="expense"
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
