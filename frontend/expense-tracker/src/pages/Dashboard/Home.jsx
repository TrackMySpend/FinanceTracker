import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

import InfoCard from "../../components/Cards/InfoCard";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import RecentIncome from "../../components/Dashboard/RecentIncome";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";

import { getDueReminders, dismissReminder } from "../../utils/reminderApi"; // Adjust the import path as necessary

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState([]);

  const fetchDashboardData = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReminders = async () => {
    try {
      const { data } = await getDueReminders();
      setReminders(data || []);
    } catch (err) {
      console.error("Failed to fetch reminders:", err);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await dismissReminder(id);
      setReminders(reminders.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to dismiss reminder:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchReminders();
  }, []);

  if (!dashboardData) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">

        {/* Reminder Alerts */}
        {reminders.length > 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4 rounded">
            <h3 className="text-lg font-semibold mb-2">🔔 You have reminders:</h3>
            {reminders.map((reminder) => (
              <div
                key={reminder._id}
                className="flex justify-between items-center border-b border-yellow-300 py-2"
              >
                <div>
                  <strong>{reminder.title}</strong>
                  <p className="text-sm">{reminder.description}</p>
                  <p className="text-xs">
                    Due: {new Date(reminder.nextDueDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(reminder._id)}
                  className="ml-4 bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Info Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={dashboardData.totalBalance || 0}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={dashboardData.totalIncome || 0}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={dashboardData.totalExpense || 0}
            color="bg-red-500"
          />
        </div>

        {/* Charts & Transaction Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />

          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />
          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
