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
    const res = await axios.get("/api/v1/auth/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchDebts = async () => {
    const res = await axios.get("/api/v1/splitbills/debts");
    setDebts(res.data);
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const idToName = id => users.find(u => u._id === id)?.name || id;

  const debtsWithNames = debts.map(d => ({
    ...d,
    fromName: idToName(d.from),
    toName: idToName(d.to),
  }));

  return (
    <DashboardLayout activeMenu="Split Bill">
      <h1>💸 Split Bill</h1>
      <SplitBillForm onSuccess={fetchDebts} />
      <BalanceTable debts={debtsWithNames} />
      <BalanceChart debts={debtsWithNames} />
    </DashboardLayout>
  );
};

export default SplitBillPage;
