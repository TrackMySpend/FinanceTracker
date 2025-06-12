
const Income = require('../models/Income');
const User = require('../models/User');
exports.addIncome = async (req, res) => {
    const userId = req.user._id;
    try{
        const { icon, amount, source, date } = req.body;

        // Validate required fields
        if (!amount || !source || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new income entry
        const newIncome = new Income({
            userId,
            icon,
            amount,
            source,
            date: new Date(date) 
        });

         await newIncome.save();
        res.status(201).json(newIncome);

    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.getAllIncome = async (req, res) => {};


exports.deleteIncome = async (req, res) => {};

exports.downloadIncomeExcel = async (req, res) => {};