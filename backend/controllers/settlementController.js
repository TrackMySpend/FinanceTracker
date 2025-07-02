const Settlement = require("../models/Settlement");
const User = require("../models/User");

exports.settleUp = async (req, res) => {
  try {
    const { from, to, amount } = req.body;

    if (!from || !to || !amount || amount <= 0) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    // Optional: verify users exist
    const users = await User.find({ _id: { $in: [from, to] } });
    if (users.length !== 2) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    const txn = new Settlement({ from, to, amount });
    await txn.save();

    res.status(201).json(txn);
  } catch (err) {
    console.error("Error creating settlement:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
