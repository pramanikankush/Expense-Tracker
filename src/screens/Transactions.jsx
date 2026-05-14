import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../data/store';
import { formatCurrency, formatDate } from '../utils/format';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import { useToast } from '../components/ui/Toast';
import Header from '../components/layout/Header';
import './Transactions.css';

export default function Transactions() {
  const { state, addTransaction, deleteTransaction } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const { transactions, categories, accounts, tags: allTags, selectedCurrency } = state;

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    account: '',
    notes: '',
    tags: [],
  });

  const tabs = [
    { id: 'all', label: 'All', count: transactions.length },
    { id: 'income', label: 'Income', count: transactions.filter(t => t.type === 'income').length },
    { id: 'expense', label: 'Expenses', count: transactions.filter(t => t.type === 'expense').length },
  ];
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (activeTab !== 'all') list = list.filter(t => t.type === activeTab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.description.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q));
    }
    if (filterCategory) list = list.filter(t => (t.category || '') === filterCategory);
    if (filterType) list = list.filter(t => t.type === filterType);
    const [field, dir] = sortBy.split('-');
    list.sort((a, b) => {
      let cmp = 0;
      if (field === 'date') cmp = new Date(a.date) - new Date(b.date);
      else if (field === 'amount') cmp = Math.abs(a.amount) - Math.abs(b.amount);
      if (dir === 'desc') cmp = -cmp;
      return cmp;
    });
    return list;
  }, [transactions, activeTab, search, filterCategory, filterType, sortBy]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.category || !form.account) {
      toast('Please fill in all required fields', 'error');
      return;
    }
    const amount = form.type === 'expense' ? -Math.abs(parseFloat(form.amount)) : Math.abs(parseFloat(form.amount));
    addTransaction({
      description: form.description,
      amount,
      type: form.type,
      category: form.category,
      account: form.account,
      date: form.date,
      notes: form.notes,
      tags: form.tags,
      isSplit: false,
      splits: [],
      receipt: null,
      recurring: null,
    });
    toast('Transaction added', 'success');
    setShowAddModal(false);
    setForm({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      account: '',
      notes: '',
      tags: [],
    });
  };

  const catOptions = categories.map(c => ({ value: c.name, label: `${c.icon || ''} ${c.name}` }));
  const accOptions = accounts.map(a => ({ value: a.id, label: `${a.name} (${formatCurrency(a.balance, selectedCurrency)})` }));
  const sortOptions = [
    { value: 'date-desc', label: 'Newest first' },
    { value: 'date-asc', label: 'Oldest first' },
    { value: 'amount-desc', label: 'Highest amount' },
    { value: 'amount-asc', label: 'Lowest amount' },
  ];
  const typeOptions = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
  ];
  const allCatOptions = [{ value: '', label: 'All categories' }, ...catOptions];

  return (
    <>
      <Header title="Transactions" subtitle={`${transactions.length} total · Manage your money flow`} />
      <div className="transactions-page">
        <div className="tx-toolbar">
          <div className="tx-filters">
            <Input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} icon="🔍" />
            <Select options={allCatOptions} value={filterCategory} onChange={e => setFilterCategory(e.target.value)} />
            <Select options={typeOptions} value={filterType} onChange={e => setFilterType(e.target.value)} placeholder="All types" />
            <Select options={sortOptions} value={sortBy} onChange={e => setSortBy(e.target.value)} />
          </div>
          <Button onClick={() => setShowAddModal(true)}>+ Add Transaction</Button>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="tx-table">
          <div className="tx-table-header">
            <span className="tx-col-date">Date</span>
            <span className="tx-col-desc">Description</span>
            <span className="tx-col-cat">Category</span>
            <span className="tx-col-acc">Account</span>
            <span className="tx-col-tags">Tags</span>
            <span className="tx-col-amount">Amount</span>
            <span className="tx-col-actions"></span>
          </div>
          {filtered.map(t => (
            <div key={t.id} className="tx-row" onClick={() => navigate(`/transactions/${t.id}`)}>
              <span className="tx-col-date">{formatDate(t.date)}</span>
              <span className="tx-col-desc">{t.description}</span>
              <span className="tx-col-cat">
                <Badge variant={t.type === 'income' ? 'success' : 'default'}>{t.category}</Badge>
              </span>
              <span className="tx-col-acc">{accounts.find(a => a.id === t.account)?.name || '—'}</span>
              <span className="tx-col-tags">
                {t.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="info">{tag}</Badge>
                ))}
              </span>
              <span className={`tx-col-amount ${t.type === 'income' ? 'positive' : ''}`}>
                {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount, selectedCurrency)}
              </span>
              <span className="tx-col-actions">
                <button className="tx-delete" onClick={(e) => { e.stopPropagation(); deleteTransaction(t.id); toast('Transaction deleted', 'info'); }}>✕</button>
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="tx-empty">No transactions found</div>
          )}
        </div>
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Transaction">
        <form className="add-tx-form" onSubmit={handleAdd}>
          <div className="form-row">
            <Input label="Date" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            <Select label="Type" options={typeOptions} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} />
          </div>
          <Input label="Description" required placeholder="e.g. Grocery shopping" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <div className="form-row">
            <Input label="Amount" type="number" step="0.01" required placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} prefix="$" />
            <Select label="Category" required options={catOptions} placeholder="Select category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
          </div>
          <Select label="Account" required options={accOptions} placeholder="Select account" value={form.account} onChange={e => setForm(p => ({ ...p, account: e.target.value }))} />
          <Input label="Notes (optional)" placeholder="Add notes..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          <div className="form-actions">
            <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Add Transaction</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
