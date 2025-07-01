import React, { useState } from "react";
import axios from "../../utils/axiosInstance";

const SplitBillForm = ({ onSuccess }) => {
  const [payer, setPayer] = useState("");
  const [participants, setParticipants] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSplitBill = async (e) => {
    e.preventDefault();

    if (!payer || !participants || !amount || isNaN(amount)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const participantIds = participants
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length === 24); // assuming valid ObjectId format

    if (participantIds.length === 0) {
      alert("Please enter at least one valid participant ID.");
      return;
    }

    const data = {
      title: description || "Untitled Bill",
      totalAmount: parseFloat(amount),
      paidBy: payer,
      participants: participantIds,
      notes: description,
    };

    try {
      setLoading(true);
      await axios.post("/api/v1/splitbills", data);
      setPayer("");
      setParticipants("");
      setAmount("");
      setDescription("");
      if (onSuccess) onSuccess(); // Refresh debts or list
    } catch (err) {
      console.error("❌ Failed to add split bill:", err);
      alert("Something went wrong. Check console and make sure all IDs are correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSplitBill}
      className="bg-white border rounded-md p-6 shadow-sm max-w-2xl"
    >
      <h2 className="text-lg font-semibold mb-4">Add a Split Expense</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Payer (User ID)</label>
        <input
          type="text"
          placeholder="e.g. 64ecdf0f50a4b43f80f3441a"
          value={payer}
          onChange={(e) => setPayer(e.target.value.trim())}
          className="w-full border px-3 py-2 rounded-md outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Participants (comma-separated User IDs)</label>
        <input
          type="text"
          placeholder="e.g. 64ecdf0f50a4b43f80f3441a, 64ecdf1f50a4b43f80f3441b"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className="w-full border px-3 py-2 rounded-md outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 900"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border px-3 py-2 rounded-md outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1">Description (optional)</label>
        <input
          type="text"
          placeholder="e.g. Dinner at Cafe"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded-md outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-5 py-2 rounded-md hover:bg-primary/90 transition"
      >
        {loading ? "Adding..." : "Add Bill"}
      </button>
    </form>
  );
};

export default SplitBillForm;
