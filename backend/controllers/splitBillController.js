const SplitBill = require("../models/SplitBill");
const calculateDebts = require("../utils/calculateDebts");

exports.createSplitBill = async (req, res) => {
  const { title, totalAmount, paidBy, participants, notes } = req.body;

  const perPerson = Math.floor(totalAmount / participants.length);
  const remainder = totalAmount % participants.length;

  const splits = participants.map((userId, index) => ({
    userId,
    paid: userId === paidBy ? totalAmount : 0,
    owes: perPerson + (index === 0 ? remainder : 0),
  }));

  const bill = new SplitBill({
    title,
    totalAmount,
    paidBy,
    participants,
    splits,
    notes,
  });

  await bill.save();
  res.status(201).json(bill);
};

exports.getDebts = async (req, res) => {
  const bills = await SplitBill.find({});
  const splits = bills.flatMap(bill => bill.splits);
  const debts = calculateDebts(splits);
  res.json(debts);
};
