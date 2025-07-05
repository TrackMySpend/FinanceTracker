const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["income", "expense", "bill", "settlement", "payment"], 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
