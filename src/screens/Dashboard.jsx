import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../data/store';
import { formatCurrency, formatDateShort } from '../utils/format';
import { totalByCategory, totalByMonth, netWorth, budgetHealth } from '../utils/calculations';
import { CHART_COLORS } from '../utils/constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Header from '../components/layout/Header';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
  const { state } = useStore();
  const navigate = useNavigate();
  const { transactions, accounts, budgets, goals, selectedCurrency } = state;
  const [quickAmount, setQuickAmount] = useState('');
  const [quickDesc, setQuickDesc] = useState('');

  const monthlyData = useMemo(() => {
    const expenses = totalByMonth(transactions, 'expense');
    const incomes = totalByMonth(transactions, 'income');
    const months = [...new Set([...Object.keys(expenses), ...Object.keys(incomes)])].sort();
    return months.map(m => ({
      month: new Date(m + '-01').toLocaleString('default', { month: 'short' }),
      expenses: Math.round(expenses[m] || 0),
      income: Math.round(incomes[m] || 0),
    }));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const cats = totalByCategory(transactions, 'expense');
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalIncome = useMemo(() =>
    transactions.filter(t => t.type === 'income').reduce((s, t) => s + Math.abs(t.amount), 0), [transactions]);

  const totalExpenses = useMemo(() =>
    transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0), [transactions]);

  const recentTransactions = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [transactions]);

  const worth = netWorth(accounts);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = useMemo(
    () => transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth)),
    [transactions, currentMonth]
  );

  return (
    <>
      <Header title="Dashboard" subtitle="Your financial overview" />
      <div className="dashboard">
        {/* KPI Row */}
        <div className="kpi-row">
          <Card variant="flat" className="kpi-card">
            <span className="kpi-label">Net Worth</span>
            <span className="kpi-value">{formatCurrency(worth, selectedCurrency)}</span>
            <span className="kpi-change positive">+{formatCurrency(totalIncome - totalExpenses, selectedCurrency)} this month</span>
          </Card>
          <Card variant="flat" className="kpi-card">
            <span className="kpi-label">Total Income</span>
            <span className="kpi-value">{formatCurrency(totalIncome, selectedCurrency)}</span>
          </Card>
          <Card variant="flat" className="kpi-card">
            <span className="kpi-label">Total Expenses</span>
            <span className="kpi-value">{formatCurrency(totalExpenses, selectedCurrency)}</span>
          </Card>
          <Card variant="flat" className="kpi-card">
            <span className="kpi-label">Accounts</span>
            <span className="kpi-value">{accounts.length}</span>
            <span className="kpi-label">{accounts.filter(a => a.balance > 0).length} active</span>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          <Card variant="default" className="chart-card">
            <h3 className="card-heading">Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#93939f' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#93939f' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14 }}
                  formatter={(v) => formatCurrency(v, selectedCurrency)}
                />
                <Bar dataKey="income" fill="#003c33" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ff7759" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card variant="default" className="chart-card">
            <h3 className="card-heading">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData.slice(0, 6)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.slice(0, 6).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v, selectedCurrency)} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Budget Health + Recent Activity */}
        <div className="bottom-row">
          <Card variant="default" className="budget-summary-card">
            <div className="card-header-row">
              <h3 className="card-heading">Budget Health</h3>
              <Button variant="secondary" onClick={() => navigate('/budgets')}>View all</Button>
            </div>
            <div className="budget-mini-list">
              {budgets.slice(0, 4).map(b => {
                const health = budgetHealth(b, monthExpenses);
                return (
                  <div key={b.id} className="budget-mini-item">
                    <div className="budget-mini-header">
                      <span className="budget-mini-name">{b.category}</span>
                      <span className="budget-mini-amount">{formatCurrency(health.spent, selectedCurrency)} / {formatCurrency(b.limit, selectedCurrency)}</span>
                    </div>
                    <ProgressBar value={health.spent} max={b.limit} color={health.percentUsed > 100 ? 'var(--color-error)' : health.percentUsed > 80 ? 'var(--color-warning)' : 'var(--color-deep-green)'} />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card variant="default" className="recent-card">
            <div className="card-header-row">
              <h3 className="card-heading">Recent Transactions</h3>
              <Button variant="secondary" onClick={() => navigate('/transactions')}>View all</Button>
            </div>
            <div className="recent-list">
              {recentTransactions.map(t => (
                <div key={t.id} className="recent-item">
                  <div className="recent-item-left">
                    <span className="recent-item-desc">{t.description}</span>
                    <span className="recent-item-meta">{t.category} · {formatDateShort(t.date)}</span>
                  </div>
                  <span className={`recent-item-amount ${t.type === 'income' ? 'positive' : ''}`}>
                    {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount, selectedCurrency)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Goals Mini */}
          <Card variant="dark-feature" className="goals-mini-card">
            <div className="card-header-row">
              <h3 className="card-heading" style={{ color: 'white' }}>Savings Goals</h3>
              <Button variant="pill-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }} onClick={() => navigate('/goals')}>View all</Button>
            </div>
            <div className="goals-mini-list">
              {goals.slice(0, 2).map(g => (
                <div key={g.id} className="goals-mini-item">
                  <div className="goals-mini-header">
                    <span>{g.name}</span>
                    <span>{formatCurrency(g.current, selectedCurrency)} / {formatCurrency(g.target, selectedCurrency)}</span>
                  </div>
                  <ProgressBar value={g.current} max={g.target} color="rgba(255,255,255,0.5)" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
