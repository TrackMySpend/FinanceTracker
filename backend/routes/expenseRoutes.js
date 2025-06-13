const express = require('express');

const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
// Route to create a new income entry
router.post('/add', protect, addExpense);
// Route to get all income entries
router.get('/get', protect, getAllExpense);
// Route to download income entries as an Excel file
router.get('/downloadexcel', protect, downloadExpenseExcel);
// Route to delete an income entry by ID
router.delete('/:id', protect, deleteExpense);

module.exports = router;