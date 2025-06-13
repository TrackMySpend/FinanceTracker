
const Income = require('../models/Income');
const User = require('../models/User');

exports.addIncome = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        const { icon, amount, source, date } = req.body;

        // Validate required fields
        if (!amount || !source || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Convert amount to a number
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) {
            return res.status(400).json({ message: 'Amount must be a valid number' });
        }

        // Create new income entry
        const newIncome = new Income({
            userId: req.user._id,
            icon: icon || '',
            amount: numericAmount,
            source,
            date: new Date(date)
        });

        // Save to DB
        await newIncome.save();
        return res.status(201).json(newIncome);

    } catch (error) {
        console.error('Add Income Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




exports.getAllIncome = async (req, res) => {};


exports.deleteIncome = async (req, res) => {};

exports.downloadIncomeExcel = async (req, res) => {};