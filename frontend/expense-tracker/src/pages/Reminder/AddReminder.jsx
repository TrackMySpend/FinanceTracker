import React, { useState } from "react";
import { addReminder } from "../../utils/reminderApi"; // Adjust path if needed

const AddReminderForm = ({ onReminderAdded }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    frequency: "weekly",
    nextDueDate: "", // Added due date
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.title.trim()) {
      return setMessage("Title is required.");
    }

    if (!form.nextDueDate) {
      return setMessage("Due Date is required.");
    }

    setLoading(true);

    try {
      await addReminder(form);
      setMessage("✅ Reminder added successfully!");
      onReminderAdded();
      setForm({
        title: "",
        description: "",
        frequency: "weekly",
        nextDueDate: "",
      });
    } catch (error) {
      console.error("Failed to add reminder:", error);
      setMessage(
        error.response?.data?.message ||
          "❌ Failed to add reminder. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 border border-gray-300 rounded shadow-md bg-white"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Add New Reminder</h2>

      <label className="block mb-3">
        <span className="font-medium">Title*</span>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="mt-1 block w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block mb-3">
        <span className="font-medium">Description</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-1 block w-full border p-2 rounded"
          rows={3}
        />
      </label>

      <label className="block mb-3">
        <span className="font-medium">Frequency</span>
        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="mt-1 block w-full border p-2 rounded"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </label>

      <label className="block mb-4">
        <span className="font-medium">Due Date*</span>
        <input
          type="date"
          name="nextDueDate"
          value={form.nextDueDate}
          onChange={handleChange}
          className="mt-1 block w-full border p-2 rounded"
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Reminder"}
      </button>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default AddReminderForm;
