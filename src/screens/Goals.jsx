import { useState } from 'react';
import { useStore } from '../data/store';
import { formatCurrency, formatDate } from '../utils/format';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import Header from '../components/layout/Header';
import './Goals.css';

export default function Goals() {
  const { state, addGoal, updateGoal, deleteGoal, addTransaction } = useStore();
  const toast = useToast();
  const { goals, accounts, selectedCurrency } = state;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', target: '', deadline: '', color: '#003c33' });
  const [contribute, setContribute] = useState({ id: '', amount: '' });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', target: '', deadline: '', color: '#003c33' });
    setShowModal(true);
  };

  const openEdit = (g) => {
    setEditing(g);
    setForm({ name: g.name, target: String(g.target), deadline: g.deadline, color: g.color });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.target) {
      toast('Please fill in all required fields', 'error');
      return;
    }
    const data = { name: form.name, target: parseFloat(form.target), deadline: form.deadline, color: form.color, current: editing?.current || 0 };
    if (editing) {
      updateGoal({ ...data, id: editing.id });
      toast('Goal updated', 'success');
    } else {
      addGoal(data);
      toast('Goal created', 'success');
    }
    setShowModal(false);
  };

  const handleContribute = (g) => {
    const amt = parseFloat(contribute.amount);
    if (!amt || amt <= 0) return;
    const newCurrent = Math.min(g.current + amt, g.target);
    updateGoal({ ...g, current: newCurrent });
    if (accounts.length > 0) {
      addTransaction({
        description: `Contribution to ${g.name}`,
        amount: -Math.abs(amt),
        type: 'expense',
        category: 'Savings',
        account: accounts[0].id,
        date: new Date().toISOString().split('T')[0],
        tags: ['goal'],
        notes: `Goal: ${g.name}`,
        isSplit: false,
        splits: [],
        receipt: null,
        recurring: null,
      });
    }
    toast(`Added ${formatCurrency(amt, selectedCurrency)} to ${g.name}`, 'success');
    setContribute({ id: '', amount: '' });
  };

  return (
    <>
      <Header title="Savings Goals" subtitle="Track your financial targets" />
      <div className="goals-page">
        <div className="goals-toolbar">
          <Button onClick={openAdd}>+ Create Goal</Button>
        </div>

        <div className="goals-grid">
          {goals.map(g => {
            const pct = g.target > 0 ? (g.current / g.target) * 100 : 0;
            const remaining = g.target - g.current;
            return (
              <Card key={g.id} variant="soft-stone" className="goal-card" onClick={() => openEdit(g)}>
                <div className="goal-card-header">
                  <span className="goal-card-name" style={{ color: g.color }}>{g.name}</span>
                  <Badge variant={pct >= 100 ? 'success' : 'info'}>{Math.round(pct)}%</Badge>
                </div>
                <ProgressBar value={g.current} max={g.target} color={g.color} />
                <div className="goal-card-stats">
                  <div className="goal-stat">
                    <span className="goal-stat-label">Current</span>
                    <span className="goal-stat-value">{formatCurrency(g.current, selectedCurrency)}</span>
                  </div>
                  <div className="goal-stat">
                    <span className="goal-stat-label">Target</span>
                    <span className="goal-stat-value">{formatCurrency(g.target, selectedCurrency)}</span>
                  </div>
                  <div className="goal-stat">
                    <span className="goal-stat-label">Remaining</span>
                    <span className="goal-stat-value">{formatCurrency(remaining, selectedCurrency)}</span>
                  </div>
                </div>
                {g.deadline && (
                  <div className="goal-deadline">
                    <span>Due {formatDate(g.deadline)}</span>
                  </div>
                )}
                <div className="goal-contribute" onClick={e => e.stopPropagation()}>
                  <Input
                    placeholder="Amount"
                    type="number"
                    value={contribute.id === g.id ? contribute.amount : ''}
                    onChange={e => setContribute({ id: g.id, amount: e.target.value })}
                    prefix="$"
                  />
                  <Button size="sm" onClick={() => handleContribute(g)}>Add</Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Goal' : 'Create Goal'}>
        <form className="goal-form" onSubmit={handleSubmit}>
          <Input label="Goal Name" required placeholder="e.g. Emergency Fund" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <div className="form-row">
            <Input label="Target Amount" type="number" step="0.01" required placeholder="0.00" value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value }))} prefix="$" />
            <Input label="Deadline" type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
          </div>
          <div className="form-actions">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            {editing && <Button variant="danger" type="button" onClick={() => { deleteGoal(editing.id); setShowModal(false); toast('Goal deleted', 'info'); }}>Delete</Button>}
            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
