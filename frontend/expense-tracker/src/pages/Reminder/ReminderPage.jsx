import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import {
  getDueReminders,
  getAllReminders,
  dismissReminder,
  deleteReminder,
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
      setDueReminders((prev) => prev.filter((r) => r._id !== id));
      fetchReminders();
    } catch (err) {
      console.error('Error dismissing reminder:', err);
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this reminder?");
  if (!confirmDelete) return;

  try {
    await deleteReminder(id);
    alert("Reminder deleted successfully."); // or use a toast here
    fetchReminders(); // Refresh
  } catch (err) {
    console.error('Error deleting reminder:', err);
    alert("Failed to delete reminder. Please try again.");
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

        {/* DUE REMINDERS */}
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
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleDismiss(reminder._id)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 text-sm"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleDelete(reminder._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ALL REMINDERS */}
        <h2 className="text-xl font-semibold mt-10 mb-4">📋 All Reminders</h2>
        {allReminders.length === 0 ? (
          <p className="text-gray-600">No reminders found.</p>
        ) : (
          <div className="space-y-4">
            {allReminders.map((reminder) => (
              <div
                key={reminder._id}
                className="bg-gray-100 border-l-4 border-gray-500 p-4 rounded flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold">{reminder.title}</h3>
                  <p>{reminder.description}</p>
                  <p className="text-xs text-gray-500">
                    Due: {new Date(reminder.nextDueDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(reminder._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReminderPage;
