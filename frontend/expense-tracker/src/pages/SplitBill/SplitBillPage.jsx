import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import SplitBillForm from "../../components/SplitBill/SplitBillForm";
import BalanceTable from "../../components/Charts/BalanceTable";
import BalanceChart from "../../components/Charts/BalanceChart";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const SplitBillPage = () => {
  const [debts, setDebts] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/v1/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchDebts = async () => {
    try {
      const res = await axios.get("/api/v1/splitbills/debts");
      setDebts(res.data);
    } catch (err) {
      console.error("Failed to fetch debts", err);
    }
  };

  const refreshData = async () => {
    await fetchUsers();
    await fetchDebts();
  };

  useEffect(() => {
    refreshData();
  }, []);

  const idToName = (id) => users.find((u) => u._id === id)?.fullName || id;

  const debtsWithNames = debts.map((d) => ({
    ...d,
    fromName: idToName(d.from),
    toName: idToName(d.to),
  }));

  return (
    <DashboardLayout activeMenu="Split Bill">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
          💸 Split Bill
        </h1>

        {/* Centered form */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg">
            <SplitBillForm users={users} onSuccess={refreshData} />
          </div>
        </div>

        {/* Chart and Table side by side on large screens */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <BalanceChart debts={debtsWithNames} />
          </div>
          <div className="flex-1">
            <BalanceTable debts={debtsWithNames} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SplitBillPage;