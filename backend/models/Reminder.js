const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  frequency: { type: String, enum: ['weekly', 'monthly'], required: true },
  nextDueDate: { type: Date, required: true },
  isDismissed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', reminderSchema);
