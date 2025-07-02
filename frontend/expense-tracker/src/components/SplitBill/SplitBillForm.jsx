import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import Select from "react-select";

const SplitBillForm = ({ onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [payer, setPayer] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/v1/auth/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  // Prepare options for react-select
  const userOptions = users.map((user) => ({
    value: user.fullName,
    label: user.fullName,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!payer) {
      alert("Please select a payer.");
      return;
    }
    if (participants.length === 0) {
      alert("Please select at least one participant.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    // Extract participant names as array of strings
    const participantNames = participants.map((p) => p.value);

    const data = {
      title: description || "Untitled Bill",
      totalAmount: Number(amount),
      paidByName: payer.value,
      participantNames,
      notes: description,
    };

    try {
      setLoading(true);
      await axios.post("/api/v1/splitbills", data);
      setPayer(null);
      setParticipants([]);
      setAmount("");
      setDescription("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to add split bill:", err?.response?.data || err.message);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-md p-6 shadow-sm max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">Add a Split Expense</h2>

      {/* Payer select */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Payer Name</label>
        <Select
          options={userOptions}
          value={payer}
          onChange={setPayer}
          placeholder="Select payer"
          isClearable
        />
      </div>

      {/* Participants multi-select */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Participants</label>
        <Select
          options={userOptions}
          value={participants}
          onChange={setParticipants}
          placeholder="Select participants"
          isMulti
          closeMenuOnSelect={false}
        />
      </div>

      {/* Amount */}
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

      {/* Description */}
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
