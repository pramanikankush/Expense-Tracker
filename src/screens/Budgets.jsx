import { useState, useMemo } from 'react';
import { useStore } from '../data/store';
import { formatCurrency } from '../utils/format';
import { budgetHealth } from '../utils/calculations';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';
import Header from '../components/layout/Header';
import './Budgets.css';

export default function Budgets() {
  const { state, addBudget, updateBudget, deleteBudget } = useStore();
  const toast = useToast();
  const { budgets, categories, transactions, selectedCurrency } = state;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthTransactions = useMemo(
    () => transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth)),
    [transactions, currentMonth]
  );
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    category: '', limit: '', period: 'monthly', rollover: false, alerts: true,
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ category: '', limit: '', period: 'monthly', rollover: false, alerts: true });
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({ category: b.category, limit: String(b.limit), period: b.period, rollover: b.rollover, alerts: b.alerts });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.limit) {
      toast('Please fill in all required fields', 'error');
      return;
    }
    const data = {
      category: form.category,
      limit: parseFloat(form.limit),
      period: form.period,
      rollover: form.rollover,
      alerts: form.alerts,
    };
    if (editing) {
      updateBudget({ ...data, id: editing.id });
      toast('Budget updated', 'success');
    } else {
      addBudget(data);
      toast('Budget created', 'success');
    }
    setShowModal(false);
  };

  const expenseCats = categories.filter(c => c.type === 'expense');
  const catOptions = expenseCats.map(c => ({ value: c.name, label: c.name }));
  const periodOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  return (
    <>
      <Header title="Budgets" subtitle="Track and manage your spending limits" />
      <div className="budgets-page">
        <div className="budgets-toolbar">
          <Button onClick={openAdd}>+ Create Budget</Button>
        </div>

        {/* Budget Cards Grid */}
        <div className="budgets-grid">
          {budgets.map(b => {
            const health = budgetHealth(b, monthTransactions);
            return (
              <Card key={b.id} variant="soft-stone" className="budget-card" onClick={() => openEdit(b)}>
                <div className="budget-card-header">
                  <span className="budget-card-name">{b.category}</span>
                  <Badge variant={health.isOver ? 'danger' : health.percentUsed > 80 ? 'warning' : 'success'}>
                    {health.isOver ? 'Over budget' : `${Math.round(health.percentUsed)}%`}
                  </Badge>
                </div>
                <ProgressBar value={health.spent} max={b.limit} color={health.isOver ? 'var(--color-error)' : health.percentUsed > 80 ? 'var(--color-warning)' : 'var(--color-deep-green)'} />
                <div className="budget-card-stats">
                  <div className="budget-stat">
                    <span className="budget-stat-label">Spent</span>
                    <span className="budget-stat-value">{formatCurrency(health.spent, selectedCurrency)}</span>
                  </div>
                  <div className="budget-stat">
                    <span className="budget-stat-label">Remaining</span>
                    <span className={`budget-stat-value ${health.remaining < 0 ? 'negative' : ''}`}>
                      {formatCurrency(health.remaining, selectedCurrency)}
                    </span>
                  </div>
                  <div className="budget-stat">
                    <span className="budget-stat-label">Limit</span>
                    <span className="budget-stat-value">{formatCurrency(b.limit, selectedCurrency)}</span>
                  </div>
                </div>
                <div className="budget-card-meta">
                  <span className="budget-period">{b.period}</span>
                  {b.rollover && <Badge variant="info">Rollover</Badge>}
                  {b.alerts && <Badge variant="info">Alerts on</Badge>}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Overspend Alert Band */}
        {budgets.some(b => budgetHealth(b, monthTransactions).isOver) && (
          <Card variant="dark-feature" className="overspend-band">
            <h3 className="card-heading" style={{ color: 'white', marginBottom: 0 }}>Budget Alerts</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-body)' }}>
              {budgets.filter(b => budgetHealth(b, monthTransactions).isOver).map(b => b.category).join(', ')} {budgets.filter(b => budgetHealth(b, monthTransactions).isOver).length > 1 ? 'are' : 'is'} over budget this month
            </p>
          </Card>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Budget' : 'Create Budget'}>
        <form className="budget-form" onSubmit={handleSubmit}>
          <Select label="Category" required options={catOptions} placeholder="Select category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
          <Input label="Monthly Limit" type="number" step="0.01" required placeholder="0.00" value={form.limit} onChange={e => setForm(p => ({ ...p, limit: e.target.value }))} prefix="$" />
          <Select label="Period" options={periodOptions} value={form.period} onChange={e => setForm(p => ({ ...p, period: e.target.value }))} />
          <label className="checkbox-label">
            <input type="checkbox" checked={form.rollover} onChange={e => setForm(p => ({ ...p, rollover: e.target.checked }))} />
            Rollover unused amount to next period
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.alerts} onChange={e => setForm(p => ({ ...p, alerts: e.target.checked }))} />
            Send alerts when approaching limit
          </label>
          <div className="form-actions">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            {editing && <Button variant="danger" type="button" onClick={() => { deleteBudget(editing.id); setShowModal(false); toast('Budget deleted', 'info'); }}>Delete</Button>}
            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
