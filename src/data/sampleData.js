import { generateId } from '../utils/format';

const now = new Date();
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, '0');

export const sampleCategories = [
  { id: 'cat-1', name: 'Housing', type: 'expense', color: '#003c33', icon: '🏠' },
  { id: 'cat-2', name: 'Food & Dining', type: 'expense', color: '#ff7759', icon: '🍽️' },
  { id: 'cat-3', name: 'Transportation', type: 'expense', color: '#1863dc', icon: '🚗' },
  { id: 'cat-4', name: 'Utilities', type: 'expense', color: '#75758a', icon: '💡' },
  { id: 'cat-5', name: 'Entertainment', type: 'expense', color: '#9b60aa', icon: '🎬' },
  { id: 'cat-6', name: 'Shopping', type: 'expense', color: '#d4a100', icon: '🛍️' },
  { id: 'cat-7', name: 'Healthcare', type: 'expense', color: '#b30000', icon: '🏥' },
  { id: 'cat-8', name: 'Education', type: 'expense', color: '#071829', icon: '📚' },
  { id: 'cat-9', name: 'Income', type: 'income', color: '#007f3a', icon: '💰' },
  { id: 'cat-10', name: 'Freelance', type: 'income', color: '#003c33', icon: '💼' },
  { id: 'cat-11', name: 'Investments', type: 'income', color: '#1863dc', icon: '📈' },
];

export const sampleAccounts = [
  { id: 'acc-1', name: 'Checking Account', type: 'checking', balance: 12450.00, institution: 'Chase Bank', color: '#1863dc' },
  { id: 'acc-2', name: 'Savings Account', type: 'savings', balance: 34200.00, institution: 'Ally Bank', color: '#007f3a' },
  { id: 'acc-3', name: 'Credit Card', type: 'credit', balance: -1230.50, institution: 'Amex', color: '#ff7759' },
  { id: 'acc-4', name: 'Cash', type: 'cash', balance: 450.00, institution: '', color: '#75758a' },
];

function tx(date, desc, amount, category, account, opts = {}) {
  return {
    id: generateId(),
    date,
    description: desc,
    amount,
    type: amount >= 0 ? 'income' : 'expense',
    category,
    account,
    tags: opts.tags || [],
    notes: opts.notes || '',
    isSplit: opts.isSplit || false,
    splits: opts.splits || [],
    receipt: opts.receipt || null,
    recurring: opts.recurring || null,
    createdAt: new Date().toISOString(),
  };
}

export const sampleTransactions = [
  tx(`${y}-${m}-15`, 'Salary Deposit', 5200.00, 'Income', 'acc-1'),
  tx(`${y}-${m}-14`, 'Whole Foods Market', -89.47, 'Food & Dining', 'acc-3'),
  tx(`${y}-${m}-14`, 'Netflix Subscription', -15.99, 'Entertainment', 'acc-3'),
  tx(`${y}-${m}-13`, 'Shell Gas Station', -52.30, 'Transportation', 'acc-3'),
  tx(`${y}-${m}-12`, 'Amazon Purchase', -124.99, 'Shopping', 'acc-3'),
  tx(`${y}-${m}-11`, 'Freelance Project Payment', 1850.00, 'Freelance', 'acc-1'),
  tx(`${y}-${m}-10`, 'Rent Payment', -1800.00, 'Housing', 'acc-1'),
  tx(`${y}-${m}-09`, 'Electric Bill', -112.50, 'Utilities', 'acc-1'),
  tx(`${y}-${m}-08`, 'Uber Rides', -23.45, 'Transportation', 'acc-3'),
  tx(`${y}-${m}-07`, 'Chipotle Lunch', -18.72, 'Food & Dining', 'acc-3'),
  tx(`${y}-${m}-06`, 'Dividend Payment', 120.00, 'Investments', 'acc-2'),
  tx(`${y}-${m}-05`, 'Target Shopping', -67.89, 'Shopping', 'acc-3'),
  tx(`${y}-${m}-04`, 'Gym Membership', -49.99, 'Healthcare', 'acc-1'),
  tx(`${y}-${m}-03`, 'Internet Bill', -74.99, 'Utilities', 'acc-1'),
  tx(`${y}-${m}-02`, 'Spotify Premium', -9.99, 'Entertainment', 'acc-3'),
  tx(`${y}-${m}-01`, 'Transfer to Savings', -500.00, 'Housing', 'acc-1', {
    tags: ['transfer'],
    notes: 'Monthly savings transfer',
  }),
  tx(`${y}-${(now.getMonth()).toString().padStart(2, '0')}-28`, 'Phone Bill', -85.00, 'Utilities', 'acc-1'),
  tx(`${y}-${(now.getMonth()).toString().padStart(2, '0')}-27`, 'Starbucks', -5.75, 'Food & Dining', 'acc-3'),
  tx(`${y}-${(now.getMonth()).toString().padStart(2, '0')}-25`, 'Freelance Invoice', 3200.00, 'Freelance', 'acc-1'),
  tx(`${y}-${(now.getMonth()).toString().padStart(2, '0')}-22`, 'Home Depot', -156.30, 'Shopping', 'acc-3'),
];

export const sampleBudgets = [
  { id: 'bud-1', category: 'Food & Dining', limit: 600, period: 'monthly', spent: 413.89, rollover: false, alerts: true },
  { id: 'bud-2', category: 'Entertainment', limit: 100, period: 'monthly', spent: 25.98, rollover: true, alerts: true },
  { id: 'bud-3', category: 'Transportation', limit: 200, period: 'monthly', spent: 75.75, rollover: false, alerts: true },
  { id: 'bud-4', category: 'Shopping', limit: 300, period: 'monthly', spent: 349.18, rollover: false, alerts: true },
  { id: 'bud-5', category: 'Utilities', limit: 250, period: 'monthly', spent: 272.49, rollover: true, alerts: false },
];

export const sampleRecurring = [
  { id: 'rec-1', description: 'Netflix', amount: -15.99, category: 'Entertainment', frequency: 'monthly', nextDate: `${y}-${m}-14`, type: 'expense', autoPost: true },
  { id: 'rec-2', description: 'Rent', amount: -1800.00, category: 'Housing', frequency: 'monthly', nextDate: `${y}-${m}-01`, type: 'expense', autoPost: false },
  { id: 'rec-3', description: 'Gym', amount: -49.99, category: 'Healthcare', frequency: 'monthly', nextDate: `${y}-${m}-04`, type: 'expense', autoPost: true },
  { id: 'rec-4', description: 'Salary', amount: 5200.00, category: 'Income', frequency: 'bi-weekly', nextDate: `${y}-${m}-15`, type: 'income', autoPost: false },
  { id: 'rec-5', description: 'Spotify', amount: -9.99, category: 'Entertainment', frequency: 'monthly', nextDate: `${y}-${m}-02`, type: 'expense', autoPost: true },
];

export const sampleGoals = [
  { id: 'goal-1', name: 'Emergency Fund', target: 15000, current: 8200, deadline: `${y+1}-06-01`, color: '#003c33' },
  { id: 'goal-2', name: 'New Laptop', target: 3000, current: 1200, deadline: `${y}-12-01`, color: '#1863dc' },
  { id: 'goal-3', name: 'Vacation Fund', target: 5000, current: 1800, deadline: `${y+1}-03-01`, color: '#ff7759' },
];

export const defaultUser = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  baseCurrency: 'USD',
  timezone: 'America/New_York',
  twoFactorEnabled: false,
  pinEnabled: false,
  exportFrequency: 'never',
};

export const sampleTags = ['transfer', 'business', 'personal', 'tax-deductible', 'recurring', 'urgent'];
