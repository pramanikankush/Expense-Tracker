export function totalByCategory(transactions, type = 'expense') {
  const map = {};
  for (const t of transactions) {
    if (t.type !== type || t.isSplit) continue;
    if (t.splits && t.splits.length > 0) {
      for (const split of t.splits) {
        const key = split.category || 'Uncategorized';
        map[key] = (map[key] || 0) + Math.abs(split.amount);
      }
    } else {
      const key = t.category || 'Uncategorized';
      map[key] = (map[key] || 0) + Math.abs(t.amount);
    }
  }
  return map;
}

export function totalByMonth(transactions, type = 'expense') {
  const map = {};
  for (const t of transactions) {
    if (t.type !== type) continue;
    const month = new Date(t.date).toISOString().slice(0, 7);
    const amount = t.splits && t.splits.length > 0
      ? t.splits.reduce((s, sp) => s + Math.abs(sp.amount), 0)
      : Math.abs(t.amount);
    map[month] = (map[month] || 0) + amount;
  }
  return map;
}

export function netWorth(accounts) {
  return accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
}

export function budgetHealth(budget, transactions) {
  const spent = transactions
    .filter(t => t.type === 'expense' && t.category === budget.category)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  return {
    spent,
    remaining: budget.limit - spent,
    percentUsed: budget.limit > 0 ? (spent / budget.limit) * 100 : 0,
    isOver: spent > budget.limit,
  };
}

export function forecastForMonth(transactions, recurring, month) {
  const oneTime = transactions
    .filter(t => t.date.startsWith(month) && t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const recurringTotal = recurring
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + Math.abs(r.amount), 0);
  return oneTime + recurringTotal;
}
