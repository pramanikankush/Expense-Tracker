import { useState } from 'react';
import { useStore } from '../data/store';
import { formatCurrency } from '../utils/format';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';
import Header from '../components/layout/Header';
import './Accounts.css';

export default function Accounts() {
  const { state, addAccount, updateAccount, deleteAccount, transfer } = useStore();
  const toast = useToast();
  const { accounts, selectedCurrency } = state;
  const [showModal, setShowModal] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [form, setForm] = useState({ name: '', type: 'checking', balance: '', institution: '', color: '#1863dc' });
  const [transferForm, setTransferForm] = useState({ from: '', to: '', amount: '' });

  const totalAssets = accounts.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalDebt = accounts.filter(a => a.balance < 0).reduce((s, a) => s + a.balance, 0);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', type: 'checking', balance: '', institution: '', color: '#1863dc' });
    setShowModal(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({ name: a.name, type: a.type, balance: String(Math.abs(a.balance)), institution: a.institution || '', color: a.color });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) { toast('Please enter account name', 'error'); return; }
    const data = {
      name: form.name,
      type: form.type,
      balance: form.type === 'credit' ? -Math.abs(parseFloat(form.balance) || 0) : Math.abs(parseFloat(form.balance) || 0),
      institution: form.institution,
      color: form.color,
    };
    if (editing) {
      updateAccount({ ...data, id: editing.id });
      toast('Account updated', 'success');
    } else {
      addAccount(data);
      toast('Account created', 'success');
    }
    setShowModal(false);
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!transferForm.from || !transferForm.to || !transferForm.amount) {
      toast('Please fill all fields', 'error');
      return;
    }
    if (transferForm.from === transferForm.to) {
      toast('Cannot transfer to same account', 'error');
      return;
    }
    const amt = parseFloat(transferForm.amount);
    if (amt <= 0) { toast('Invalid amount', 'error'); return; }
    transfer(transferForm.from, transferForm.to, amt);
    toast('Transfer completed', 'success');
    setShowTransfer(false);
    setTransferForm({ from: '', to: '', amount: '' });
  };

  const accountTypeOptions = [
    { value: 'checking', label: 'Checking' },
    { value: 'savings', label: 'Savings' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'cash', label: 'Cash' },
    { value: 'investment', label: 'Investment' },
    { value: 'other', label: 'Other' },
  ];

  const accOptions = accounts.map(a => ({ value: a.id, label: `${a.name} (${formatCurrency(a.balance, selectedCurrency)})` }));

  return (
    <>
      <Header title="Accounts" subtitle="Manage your financial accounts" />
      <div className="accounts-page">
        <div className="accounts-toolbar">
          <div className="accounts-summary">
            <span>Assets: <strong>{formatCurrency(totalAssets, selectedCurrency)}</strong></span>
            <span className="summary-sep">·</span>
            <span>Debt: <strong className="negative">{formatCurrency(Math.abs(totalDebt), selectedCurrency)}</strong></span>
            <span className="summary-sep">·</span>
            <span>Net: <strong className={totalAssets + totalDebt >= 0 ? 'positive' : 'negative'}>{formatCurrency(totalAssets + totalDebt, selectedCurrency)}</strong></span>
          </div>
          <div className="accounts-actions">
            <Button variant="pill-outline" onClick={() => setShowTransfer(true)}>Transfer</Button>
            <Button onClick={openAdd}>+ Add Account</Button>
          </div>
        </div>

        <div className="accounts-grid">
          {accounts.map(a => (
            <Card key={a.id} variant="soft-stone" className="account-card" onClick={() => openEdit(a)}>
              <div className="account-card-header">
                <div className="account-card-left">
                  <div className="account-color-dot" style={{ background: a.color }} />
                  <div>
                    <span className="account-card-name">{a.name}</span>
                    {a.institution && <span className="account-card-inst">{a.institution}</span>}
                  </div>
                </div>
                <Badge variant={a.type === 'credit' ? 'warning' : 'info'}>{a.type}</Badge>
              </div>
              <span className={`account-card-balance ${a.balance < 0 ? 'negative' : ''}`}>
                {formatCurrency(a.balance, selectedCurrency)}
              </span>
              {deleting === a.id ? (
                <div className="account-delete-confirm">
                  <span>Delete {a.name}?</span>
                  <div>
                    <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); deleteAccount(a.id); setDeleting(null); toast('Account deleted', 'info'); }}>Confirm</Button>
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setDeleting(null); }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setDeleting(a.id); }}>Delete</Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Account' : 'Add Account'}>
        <form className="account-form" onSubmit={handleSubmit}>
          <Input label="Account Name" required placeholder="e.g. Checking Account" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <div className="form-row">
            <Select label="Type" options={accountTypeOptions} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} />
            <Input label="Balance" type="number" step="0.01" placeholder="0.00" value={form.balance} onChange={e => setForm(p => ({ ...p, balance: e.target.value }))} prefix="$" />
          </div>
          <Input label="Institution (optional)" placeholder="e.g. Chase Bank" value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))} />
          <div className="form-actions">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showTransfer} onClose={() => setShowTransfer(false)} title="Transfer Between Accounts">
        <form className="transfer-form" onSubmit={handleTransfer}>
          <Select label="From" required options={accOptions} placeholder="Select source account" value={transferForm.from} onChange={e => setTransferForm(p => ({ ...p, from: e.target.value }))} />
          <Select label="To" required options={accOptions} placeholder="Select destination account" value={transferForm.to} onChange={e => setTransferForm(p => ({ ...p, to: e.target.value }))} />
          <Input label="Amount" type="number" step="0.01" required placeholder="0.00" value={transferForm.amount} onChange={e => setTransferForm(p => ({ ...p, amount: e.target.value }))} prefix="$" />
          <div className="form-actions">
            <Button variant="ghost" type="button" onClick={() => setShowTransfer(false)}>Cancel</Button>
            <Button type="submit">Transfer</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
