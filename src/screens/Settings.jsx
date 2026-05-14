import { useState } from 'react';
import { useStore } from '../data/store';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';
import Header from '../components/layout/Header';
import './Settings.css';

export default function Settings() {
  const { state, updateUser, setCurrency } = useStore();
  const toast = useToast();
  const { user, categories, tags, selectedCurrency } = state;
  const [userForm, setUserForm] = useState({
    name: user.name || '',
    email: user.email || '',
    timezone: user.timezone || 'America/New_York',
  });

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
  ];

  const tzOptions = [
    { value: 'America/New_York', label: 'Eastern (ET)' },
    { value: 'America/Chicago', label: 'Central (CT)' },
    { value: 'America/Denver', label: 'Mountain (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser(userForm);
    toast('Profile updated', 'success');
  };

  const handleExportCSV = () => {
    const data = state.transactions;
    const header = 'Date,Description,Amount,Category,Account,Type,Notes,Tags\n';
    const rows = data.map(t => {
      const acc = state.accounts.find(a => a.id === t.account);
      return `${t.date},"${t.description}",${t.amount},${t.category || ''},${acc?.name || ''},${t.type},"${t.notes || ''}","${(t.tags || []).join(';')}"`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('CSV exported', 'success');
  };

  return (
    <>
      <Header title="Settings" subtitle="Customize your experience" />
      <div className="settings-page">
        {/* Profile */}
        <Card variant="default" className="settings-card">
          <h3 className="card-heading">Profile</h3>
          <form className="settings-form" onSubmit={handleSaveProfile}>
            <div className="form-row">
              <Input label="Name" value={userForm.name} onChange={e => setUserForm(p => ({ ...p, name: e.target.value }))} />
              <Input label="Email" type="email" value={userForm.email} onChange={e => setUserForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <Select label="Timezone" options={tzOptions} value={userForm.timezone} onChange={e => setUserForm(p => ({ ...p, timezone: e.target.value }))} />
            <div className="form-actions">
              <Button type="submit">Save Profile</Button>
            </div>
          </form>
        </Card>

        {/* Currency */}
        <Card variant="default" className="settings-card">
          <h3 className="card-heading">Currency</h3>
          <Select label="Base Currency" options={currencyOptions} value={selectedCurrency} onChange={e => setCurrency(e.target.value)} />
          <p className="settings-note">All amounts will be displayed in this currency.</p>
        </Card>

        {/* Security */}
        <Card variant="default" className="settings-card">
          <h3 className="card-heading">Security</h3>
          <div className="settings-row">
            <div>
              <span className="settings-row-label">Two-Factor Authentication</span>
              <span className="settings-row-desc">Add an extra layer of security</span>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={user.twoFactorEnabled || false} onChange={e => updateUser({ twoFactorEnabled: e.target.checked })} />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="settings-row">
            <div>
              <span className="settings-row-label">PIN Lock</span>
              <span className="settings-row-desc">Require PIN to access the app</span>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={user.pinEnabled || false} onChange={e => updateUser({ pinEnabled: e.target.checked })} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </Card>

        {/* Export */}
        <Card variant="default" className="settings-card">
          <h3 className="card-heading">Export</h3>
          <p className="settings-note">Download your data for backup or analysis.</p>
          <Button onClick={handleExportCSV}>Export as CSV</Button>
        </Card>

        {/* Categories Summary */}
        <Card variant="default" className="settings-card">
          <h3 className="card-heading">Categories</h3>
          <div className="settings-cats">
            {categories.map(c => (
              <div key={c.id} className="settings-cat-item">
                <div className="settings-cat-left">
                  <span className="settings-cat-dot" style={{ background: c.color }} />
                  <span>{c.name}</span>
                </div>
                <span className="settings-cat-type">{c.type}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tags Summary */}
        <Card variant="default" className="settings-card">
          <h3 className="card-heading">Tags</h3>
          <div className="settings-tags">
            {tags.map(tag => (
              <span key={tag} className="settings-tag">{tag}</span>
            ))}
          </div>
        </Card>

        <p className="settings-version">Expense Tracker v{__APP_VERSION__}</p>
      </div>
    </>
  );
}
