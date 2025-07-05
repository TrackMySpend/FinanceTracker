const express = require("express");
const router = express.Router();
const {
  createSplitBill,
  getDebts,
  payBill, // ⬅️ Add this line
} = require("../controllers/splitBillController");

router.post("/", createSplitBill);
router.get("/debts", getDebts);
router.post("/pay", payBill); // ⬅️ Add this route

module.exports = router;
