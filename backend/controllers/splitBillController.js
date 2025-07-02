const SplitBill = require("../models/SplitBill");
const User = require("../models/User");
const calculateDebts = require("../utils/calculateDebts");

exports.createSplitBill = async (req, res) => {
  try {
    const { title, totalAmount, paidByName, participantNames, notes } = req.body;

    if (
      !title ||
      !totalAmount ||
      !paidByName ||
      !Array.isArray(participantNames) ||
      participantNames.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const allNames = Array.from(new Set([paidByName, ...participantNames]));

    const users = await User.find({
      fullName: { $in: allNames.map(name => new RegExp(`^${name.trim()}$`, "i")) },
    });

    const paidByUser = users.find(user => user.fullName.toLowerCase() === paidByName.toLowerCase());
    if (!paidByUser) return res.status(400).json({ error: "Payer not found" });

    const participantUsers = users.filter(user =>
      participantNames.map(n => n.toLowerCase()).includes(user.fullName.toLowerCase())
    );

    if (participantUsers.length !== participantNames.length) {
      return res.status(400).json({ error: "Some participants not found" });
    }

    // Include payer in the split calculation
    const allSplitUsers = Array.from(new Set([paidByUser._id.toString(), ...participantUsers.map(u => u._id.toString())]));

    const perPerson = Math.floor(totalAmount / allSplitUsers.length);
    const remainder = totalAmount % allSplitUsers.length;

    const splits = allSplitUsers.map((userId, index) => ({
      userId,
      paid: userId === paidByUser._id.toString() ? totalAmount : 0,
      owes: perPerson + (index === 0 ? remainder : 0), // give remainder to first user
    }));

    const bill = new SplitBill({
      title,
      totalAmount,
      paidBy: paidByUser._id,
      participants: participantUsers.map(u => u._id),
      splits,
      notes,
    });

    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    console.error("Error creating split bill:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.getDebts = async (req, res) => {
  try {
    const bills = await SplitBill.find({});
    const allSplits = bills.flatMap(bill => bill.splits || []);

    // Validate each split before using it
    const validSplits = allSplits.filter(
      s => s && s.userId && typeof s.paid === "number" && typeof s.owes === "number"
    );

    if (validSplits.length === 0) {
      return res.status(400).json({ error: "No valid splits found" });
    }

    const debts = calculateDebts(validSplits);
    res.json(debts);
  } catch (err) {
    console.error("Error fetching debts:", err);
    res.status(500).json({ error: "Internal Server Error", detail: err.message });
  }
};
