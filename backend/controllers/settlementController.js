const Settlement = require("../models/Settlement");
const User = require("../models/User");

exports.settleUp = async (req, res) => {
  try {
    const { from, to, amount } = req.body;

    // ✅ Validate input
    if (!from || !to || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    // 🔍 Find users by fullName (case-insensitive)
    const users = await User.find({
      fullName: { $in: [new RegExp(`^${from}$`, "i"), new RegExp(`^${to}$`, "i")] },
    });

    if (users.length !== 2) {
      return res.status(400).json({ error: "One or both users not found" });
    }

    const payer = users.find(u => u.fullName.toLowerCase() === from.toLowerCase());
    const receiver = users.find(u => u.fullName.toLowerCase() === to.toLowerCase());

    if (!payer || !receiver) {
      return res.status(400).json({ error: "User name mismatch" });
    }

    const amt = Number(amount);

    // 🚨 Ensure balances are numbers
    payer.balance = Number(payer.balance || 0);
    receiver.balance = Number(receiver.balance || 0);

    if (payer.balance < amt) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // 💾 Save the settlement transaction
    const settlement = new Settlement({
      from: payer.fullName,
      to: receiver.fullName,
      amount: amt,
    });
    await settlement.save();

    // 💰 Update balances
    payer.balance -= amt;
    receiver.balance += amt;

    await payer.save();
    await receiver.save();

    // ✅ Success response
    res.status(201).json({
      success: true,
      data: {
        settlement,
        payer: {
          name: payer.fullName,
          balance: payer.balance
        },
        receiver: {
          name: receiver.fullName,
          balance: receiver.balance
        }
      },
      message: `${payer.fullName} paid ₹${amt} to ${receiver.fullName}`
    });

  } catch (err) {
    console.error("❌ Error in settleUp:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
