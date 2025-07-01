function calculateDebts(splits) {
  const balanceMap = {};

  for (const { userId, paid, owes } of splits) {
    if (!balanceMap[userId]) balanceMap[userId] = 0;
    balanceMap[userId] += paid - owes;
  }

  const creditors = [];
  const debtors = [];

  for (const [userId, balance] of Object.entries(balanceMap)) {
    if (balance > 0) creditors.push({ userId, balance });
    else if (balance < 0) debtors.push({ userId, balance: -balance });
  }

  const transactions = [];

  for (const debtor of debtors) {
    for (const creditor of creditors) {
      if (debtor.balance === 0) break;
      const amount = Math.min(debtor.balance, creditor.balance);
      if (amount === 0) continue;

      transactions.push({ from: debtor.userId, to: creditor.userId, amount });

      debtor.balance -= amount;
      creditor.balance -= amount;
    }
  }

  return transactions;
}

module.exports = calculateDebts;
