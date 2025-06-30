import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import {
  getDueReminders,
  getAllReminders,
  dismissReminder,
} from '../../utils/reminderApi';
import AddReminderForm from './AddReminder';

const ReminderPage = () => {
  const [dueReminders, setDueReminders] = useState([]);
  const [allReminders, setAllReminders] = useState([]);

  const fetchReminders = async () => {
    try {
      const due = await getDueReminders();
      const all = await getAllReminders();
      setDueReminders(due.data || []);
      setAllReminders(all.data || []);
    } catch (err) {
      console.error('Error fetching reminders:', err);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await dismissReminder(id);
      // Remove from dueReminders (since it's now snoozed)
      setDueReminders((prev) => prev.filter((r) => r._id !== id));
      // Refresh all reminders to update nextDueDate
      fetchReminders();
    } catch (err) {
      console.error('Error dismissing reminder:', err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <DashboardLayout activeMenu="Reminders">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Set Reminders</h1>
        <AddReminderForm onReminderAdded={fetchReminders} />

        <h2 className="text-xl font-semibold mt-8 mb-4">🔔 Due Reminders</h2>
        {dueReminders.length === 0 ? (
          <p className="text-gray-600">No due reminders!</p>
        ) : (
          <div className="space-y-4">
            {dueReminders.map((reminder) => (
              <div
                key={reminder._id}
                className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold">{reminder.title}</h3>
                  <p>{reminder.description}</p>
                  <p className="text-xs text-gray-500">
                    Due: {new Date(reminder.nextDueDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(reminder._id)}
                  className="ml-4 bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 text-sm"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-xl font-semibold mt-10 mb-4">📋 All Reminders</h2>
        {allReminders.length === 0 ? (
          <p className="text-gray-600">No reminders found.</p>
        ) : (
          <div className="space-y-4">
            {allReminders.map((reminder) => (
              <div
                key={reminder._id}
                className="bg-gray-100 border-l-4 border-gray-500 p-4 rounded"
              >
                <h3 className="font-bold">{reminder.title}</h3>
                <p>{reminder.description}</p>
                <p className="text-xs text-gray-500">
                  Due: {new Date(reminder.nextDueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReminderPage;
