const xlsx = require('xlsx');
const Expense = require('../models/Expense');
const User = require('../models/User');


exports.addExpense = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
         }

        const { icon, category, amount, date } = req.body;

        // Validate required fields
        if (!amount || !category || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Convert amount to a number
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) {
            return res.status(400).json({ message: 'Amount must be a valid number' });
        }

        // Create new income entry
        const newExpense = new Expense({
            userId: req.user._id,
            icon: icon || '',
            category,
            amount: numericAmount,
            date: new Date(date)
        });

        // Save to DB
        await newExpense.save();
        return res.status(201).json(newExpense);

    } catch (error) {
        console.error('Add Expense Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        // Fetch all income entries for the authenticated user
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expense);
    } catch (error) {
        console.error('Get All Expens e Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.deleteExpense = async (req, res) => {
    const userId = req.user.id;
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Expense entry deleted successfully' }); 
    }catch (error) {
        console.error('Delete Expense Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try{
        const expense= await Expense.find({ userId }).sort({ date: -1 });
        const data= expense.map((item) => ({
            Category: item.category,

            Amount: item.amount,
            Date: item.date,
         }));
         const wb= xlsx.utils.book_new();
         const ws= xlsx.utils.json_to_sheet(data);
         xlsx.utils.book_append_sheet(wb, ws, 'expense');
         xlsx.writeFile(wb, 'expense_details.xlsx');
         res.download('expense_details.xlsx');

    }catch (error) {
        console.error('Download Expense Excel Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};