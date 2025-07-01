const express = require("express");
const router = express.Router();
const { settleUp } = require("../controllers/settlementController");

router.post("/", settleUp);

module.exports = router;
