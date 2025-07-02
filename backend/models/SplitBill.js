const mongoose = require("mongoose");

const splitBillSchema = new mongoose.Schema({
  title: String,
  totalAmount: Number,
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  splits: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      paid: { type: Number, required: true },
      owes: { type: Number, required: true },
    },
  ],
  notes: String,
});


module.exports = mongoose.model("SplitBill", splitBillSchema);
