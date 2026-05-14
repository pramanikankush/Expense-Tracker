import { useMemo, useState } from 'react';
import { useStore } from '../data/store';
import { formatCurrency } from '../utils/format';
import { totalByCategory, totalByMonth } from '../utils/calculations';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Header from '../components/layout/Header';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { CHART_COLORS } from '../utils/constants';
import './Reports.css';

export default function Reports() {
  const { state } = useStore();
  const { transactions, selectedCurrency } = state;
  const [period, setPeriod] = useState('3m');

  const filtered = useMemo(() => {
    const now = new Date();
    let cutoff;
    if (period === '1m') cutoff = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    else if (period === '3m') cutoff = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    else if (period === '6m') cutoff = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    else if (period === '1y') cutoff = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    else cutoff = new Date(0);
    return transactions.filter(t => new Date(t.date) >= cutoff);
  }, [transactions, period]);

  const monthlyExpenses = useMemo(() => totalByMonth(filtered, 'expense'), [filtered]);
  const monthlyIncome = useMemo(() => totalByMonth(filtered, 'income'), [filtered]);
  const categoryExpenses = useMemo(() => totalByCategory(filtered, 'expense'), [filtered]);

  const cashflowData = useMemo(() => {
    const months = [...new Set([...Object.keys(monthlyExpenses), ...Object.keys(monthlyIncome)])].sort();
    return months.map(m => ({
      month: new Date(m + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
      expenses: Math.round(monthlyExpenses[m] || 0),
      income: Math.round(monthlyIncome[m] || 0),
      net: Math.round((monthlyIncome[m] || 0) - (monthlyExpenses[m] || 0)),
    }));
  }, [monthlyExpenses, monthlyIncome]);

  const categoryData = useMemo(() => {
    return Object.entries(categoryExpenses)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [categoryExpenses]);

  const totalSpent = useMemo(() => filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0), [filtered]);
  const totalEarned = useMemo(() => filtered.filter(t => t.type === 'income').reduce((s, t) => s + Math.abs(t.amount), 0), [filtered]);

  const periodOptions = [
    { value: '1m', label: 'Last month' },
    { value: '3m', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' },
    { value: 'all', label: 'All time' },
  ];

  return (
    <>
      <Header title="Reports" subtitle="Analyze your spending patterns" />
      <div className="reports-page">
        <div className="reports-controls">
          <Select options={periodOptions} value={period} onChange={e => setPeriod(e.target.value)} />
        </div>

        {/* Summary cards */}
        <div className="report-summary-row">
          <Card variant="flat" className="report-summary-card">
            <span className="report-summary-label">Total Income</span>
            <span className="report-summary-value positive">{formatCurrency(totalEarned, selectedCurrency)}</span>
          </Card>
          <Card variant="flat" className="report-summary-card">
            <span className="report-summary-label">Total Expenses</span>
            <span className="report-summary-value">{formatCurrency(totalSpent, selectedCurrency)}</span>
          </Card>
          <Card variant="flat" className="report-summary-card">
            <span className="report-summary-label">Net</span>
            <span className={`report-summary-value ${totalEarned - totalSpent >= 0 ? 'positive' : ''}`}>
              {formatCurrency(totalEarned - totalSpent, selectedCurrency)}
            </span>
          </Card>
          <Card variant="flat" className="report-summary-card">
            <span className="report-summary-label">Transactions</span>
            <span className="report-summary-value">{filtered.length}</span>
          </Card>
        </div>

        {/* Cashflow Chart */}
        <Card variant="default" className="report-chart-card">
          <h3 className="card-heading">Cashflow</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={cashflowData}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#93939f' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#93939f' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} formatter={(v) => formatCurrency(v, selectedCurrency)} />
              <Area type="monotone" dataKey="income" stroke="#003c33" fill="#003c33" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="#ff7759" fill="#ff7759" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <div className="report-charts-row">
          {/* Category breakdown */}
          <Card variant="default" className="report-chart-card">
            <h3 className="card-heading">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12, fill: '#93939f' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#75758a' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} formatter={(v) => formatCurrency(v, selectedCurrency)} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Net trend */}
          <Card variant="default" className="report-chart-card">
            <h3 className="card-heading">Net Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cashflowData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#93939f' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#93939f' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} formatter={(v) => formatCurrency(v, selectedCurrency)} />
                <Line type="monotone" dataKey="net" stroke="#1863dc" strokeWidth={2} dot={{ r: 4, fill: '#1863dc' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </>
  );
}
