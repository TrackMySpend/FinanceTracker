const Settlement = require("../models/Settlement");

exports.settleUp = async (req, res) => {
  const { from, to, amount } = req.body;
  const txn = new Settlement({ from, to, amount });
  await txn.save();
  res.status(201).json(txn);
};
