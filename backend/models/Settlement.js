const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema({
  // from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  from: { type: String, required: true }, // fullName of sender
to: { type: String, required: true },   // fullName of receiver

  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Settlement", settlementSchema);
