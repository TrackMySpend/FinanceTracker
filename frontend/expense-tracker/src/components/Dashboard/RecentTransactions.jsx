import React from "react";
import { LuArrowRight } from "react-icons/lu";
import moment from "moment";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const RecentTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="bg-base-100 border border-base-300 rounded-xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold text-base-content">Recent Transactions</h5>
        <button
          onClick={onSeeMore}
          className="btn btn-sm btn-ghost text-sm gap-1"
        >
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="space-y-4">
        {transactions?.slice(0, 5).map((item) => (
          <TransactionInfoCard
            key={item._id}
            title={item.type === "expense" ? item.category : item.source}
            icon={item.icon}
            date={moment(item.date).format("DD MMM YYYY")}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
