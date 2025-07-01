const express = require("express");
const router = express.Router();
const { createSplitBill, getDebts } = require("../controllers/splitBillController");

router.post("/", createSplitBill);
router.get("/debts", getDebts);

module.exports = router;
