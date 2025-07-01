import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import SplitBillForm from "../../components/SplitBill/SplitBillForm";
import BalanceTable from "../../components/Charts/BalanceTable";
import BalanceChart from "../../components/Charts/BalanceChart";
import DashboardLayout from "../../components/layouts/DashboardLayout"; // ✅ import layout

const SplitBillPage = () => {
  const [debts, setDebts] = useState([]);

  // Fetch current split balances
  const fetchDebts = async () => {
    try {
      const response = await axios.get("/splitbills/debts");
      setDebts(response.data);
    } catch (error) {
      console.error("Error fetching debts:", error);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  return (
    <DashboardLayout activeMenu="Split Bill"> {/* ✅ Wrap with layout */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">💸 Split Bill</h1>

        {/* Form to create a new split bill */}
        <SplitBillForm onSuccess={fetchDebts} />

        {/* List of balances */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Who Owes Whom</h2>
          <BalanceTable debts={debts} />
        </div>

        {/* Pie Chart visualization */}
        <div className="mt-10 max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Debt Breakdown</h2>
          <BalanceChart debts={debts} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SplitBillPage;
