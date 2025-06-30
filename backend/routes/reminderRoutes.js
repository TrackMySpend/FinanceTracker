const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const {protect} = require('../middleware/authMiddleware'); // Assuming you already have it

// Add reminder
router.post('/', protect , async (req, res) => {
  try {
    const { title, description, frequency } = req.body;

    if (!title || !frequency) {
      return res.status(400).json({ message: 'Title and frequency are required' });
    }

    // 🔢 Calculate nextDueDate
    const nextDueDate = new Date();
    if (frequency === 'weekly') {
      nextDueDate.setDate(nextDueDate.getDate() + 7);
    } else if (frequency === 'monthly') {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    }

    const reminder = new Reminder({
      title,
      description,
      frequency,
      userId: req.user.id,
      nextDueDate
    });

    await reminder.save();

    res.status(201).json(reminder);
  } catch (err) {
    console.error('❌ Error adding reminder:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// Get due reminders
router.get('/due', protect , async (req, res) => {
  try {
    const today = new Date();
    const reminders = await Reminder.find({
      userId: req.user.id,
      isDismissed: false,
      nextDueDate: { $lte: today }
    });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all reminders (regardless of due date)
router.get('/all', protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }).sort({ nextDueDate: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Dismiss and schedule next reminder
router.post('/:id/dismiss', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });

    const newDate = new Date(reminder.nextDueDate);
    if (reminder.frequency === 'weekly') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (reminder.frequency === 'monthly') {
      newDate.setMonth(newDate.getMonth() + 1);
    }

    reminder.nextDueDate = newDate;
    await reminder.save();

    res.json({ message: 'Reminder snoozed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
