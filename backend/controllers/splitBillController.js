const SplitBill = require("../models/SplitBill");
const User = require("../models/User");
const calculateDebts = require("../utils/calculateDebts");
const Transaction = require("../models/Transaction");
const Expense = require("../models/Expense");

// 📌 Create a new split bill


exports.createSplitBill = async (req, res) => {
  try {
    const { title, totalAmount, paidByName, participantNames, notes } = req.body;

    if (!title || !totalAmount || !paidByName || !Array.isArray(participantNames) || participantNames.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const allNames = Array.from(new Set([paidByName, ...participantNames]));
    const users = await User.find({
      fullName: { $in: allNames.map(name => new RegExp(`^${name.trim()}$`, "i")) },
    });

    const paidByUser = users.find(u => u.fullName.toLowerCase() === paidByName.toLowerCase());
    if (!paidByUser) return res.status(400).json({ error: "Payer not found" });

    const participantUsers = users.filter(u =>
      participantNames.map(n => n.toLowerCase()).includes(u.fullName.toLowerCase())
    );
    if (participantUsers.length !== participantNames.length) {
      return res.status(400).json({ error: "Some participants not found" });
    }

    const allUserIds = Array.from(new Set([
      paidByUser._id.toString(),
      ...participantUsers.map(u => u._id.toString())
    ]));

    const perPerson = Math.floor(totalAmount / allUserIds.length);
    const remainder = totalAmount % allUserIds.length;

    const splits = allUserIds.map((userId, idx) => ({
      userId,
      paid: userId === paidByUser._id.toString() ? totalAmount : 0,
      owes: perPerson + (idx === 0 ? remainder : 0),
    }));

    const bill = new SplitBill({
      title,
      totalAmount,
      paidBy: paidByUser._id,
      participants: participantUsers.map(u => u._id),
      splits,
      notes,
    });

    // ✅ Update balances: ensure all math is numeric (not string concatenation)
    for (const split of splits) {
      const user = users.find(u => u._id.toString() === split.userId);
      if (!user) continue;

      const currentBalance = Number(user.balance || 0);
      const paid = Number(split.paid || 0);
      const owes = Number(split.owes || 0);
      const updatedBalance = currentBalance + (paid - owes);

      user.balance = updatedBalance;
      await user.save();
    }

    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    console.error("❌ Error creating split bill:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




// 📌 Get net debts for all users
exports.getDebts = async (req, res) => {
  try {
    const bills = await SplitBill.find({});
    const allSplits = bills.flatMap(bill => bill.splits || []);

    const validSplits = allSplits.filter(
      s => s && s.userId && typeof s.paid === "number" && typeof s.owes === "number"
    );

    if (validSplits.length === 0) {
      return res.status(400).json({ error: "No valid splits found" });
    }

    const debts = calculateDebts(validSplits);
    res.json(debts);
  } catch (err) {
    console.error("❌ Error fetching debts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📌 Pay a bill (with real-time update and transaction/expense log)
exports.payBill = async (req, res) => {
  const { from, to, amount } = req.body;
  console.log("🔹 Incoming payBill:", { from, to, amount });

  try {
    // Step 1: User lookup
    const payer = await User.findOne({ fullName: new RegExp(`^${from}$`, "i") });
    const receiver = await User.findOne({ fullName: new RegExp(`^${to}$`, "i") });

    if (!payer || !receiver) {
      console.log("❌ User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (typeof payer.balance !== "number") payer.balance = 0;
    if (typeof receiver.balance !== "number") receiver.balance = 0;

    if (payer.balance < amount) {
      console.log("❌ Insufficient balance");
      return res.status(400).json({ error: "Insufficient balance" });
    }

    console.log("✅ Users found. Proceeding...");

    // Step 2: Update balances
    payer.balance -= amount;
    receiver.balance += amount;

    await payer.save();
    await receiver.save();
    console.log("✅ Balances updated.");

    // Step 3: Update SplitBills
    const bills = await SplitBill.find({});
    for (const bill of bills) {
      const payerSplit = bill.splits.find(s => s.userId.toString() === payer._id.toString());
      const receiverSplit = bill.splits.find(s => s.userId.toString() === receiver._id.toString());

      if (payerSplit && receiverSplit) {
        const actualDebt = Math.min(payerSplit.owes, amount);
        payerSplit.owes -= actualDebt;
        receiverSplit.paid -= actualDebt;
      }
    }

    await Promise.all(bills.map(bill => bill.save()));
    console.log("✅ Bill splits updated.");

    // Step 4: Create Transaction
    const txn = await Transaction.create({
      from: payer.fullName,
      to: receiver.fullName,
      amount,
      type: "payment",
      description: "Debt settlement",
      date: new Date(),
    });
    console.log("✅ Transaction logged:", txn._id);

    // Step 5: Create Expense
    const exp = await Expense.create({
      user: payer._id,
      category: "Debt Payment",
      amount,
      date: new Date(),
    });
    console.log("✅ Expense logged:", exp._id);

    // Step 6: Emit real-time event
    const io = req.app.get("io");
    if (io) {
      io.emit("billPaid", {
        from,
        to,
        amount,
        message: `${from} paid ₹${amount} to ${to}`,
      });
      console.log("📡 Real-time event emitted");
    }

    res.status(200).json({
      success: true,
      message: "Payment successful",
      transaction: txn,
      expense: exp,
      updatedBalances: {
        [payer.fullName]: payer.balance,
        [receiver.fullName]: receiver.balance,
      },
    });
  } catch (err) {
    console.error("💥 Payment error:", {
      message: err.message,
      stack: err.stack,
      input: { from, to, amount },
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};
