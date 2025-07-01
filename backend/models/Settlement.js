const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  settledAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Settlement", settlementSchema);
