const mongoose = require("mongoose");

const splitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  paid: Number,
  owes: Number,
});

const splitBillSchema = new mongoose.Schema(
  {
    title: String,
    totalAmount: Number,
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    splits: [splitSchema],
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SplitBill", splitBillSchema);
