const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    createIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel
} = require('../controllers/incomeController');
const router = express.Router();
// Route to create a new income entry
router.post('/add', protect, addIncome);
// Route to get all income entries
router.get('/get', protect, getAllIncome);
// Route to download income entries as an Excel file
router.get('/downloadexcel', protect, downloadIncomeExcel);
// Route to delete an income entry by ID
router.delete('/:id', protect, deleteIncome);

module.exports = router;