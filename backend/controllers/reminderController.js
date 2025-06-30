// controllers/reminderController.js
exports.addReminder = async (req, res) => {
  try {
    const { title, description, frequency } = req.body;

    if (!title || !frequency) {
      return res.status(400).json({ message: "Title and frequency are required" });
    }

    const reminder = new Reminder({
      userId: req.user._id,  // ✅ this now matches your schema
      title,
      description,
      frequency,
      nextDueDate: calculateNextDueDate(frequency),
    });

    await reminder.save();

    res.status(201).json(reminder);
  } catch (error) {
    console.error("Error in addReminder:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDueReminders = async (req, res) => {
  try {
    const today = new Date();
    const reminders = await Reminder.find({
      user: req.user._id,
      isDismissed: false,
      nextDueDate: { $lte: today },
    });

    res.json(reminders);
  } catch (error) {
    console.error("Error in getDueReminders:", error); // <--- This line will help you debug
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id });
    res.json(reminders);
  } catch (error) {
    console.error("Error in getAllReminders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.dismissReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    reminder.isDismissed = true;
    reminder.nextDueDate = calculateNextDueDate(reminder.frequency);
    await reminder.save();

    res.json({ message: "Reminder dismissed and rescheduled", nextDueDate: reminder.nextDueDate });
  } catch (error) {
    console.error("Error in dismissReminder:", error); // <--- This line will help you debug
    res.status(500).json({ message: "Internal Server Error" });
  }
}