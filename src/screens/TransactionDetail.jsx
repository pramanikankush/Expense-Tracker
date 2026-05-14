import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../data/store';
import { formatCurrency, formatDate } from '../utils/format';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import Header from '../components/layout/Header';
import './TransactionDetail.css';

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, deleteTransaction } = useStore();
  const toast = useToast();
  const tx = state.transactions.find(t => t.id === id);
  const account = state.accounts.find(a => a.id === tx?.account);
  const { selectedCurrency } = state;

  if (!tx) {
    return (
      <>
        <Header title="Transaction" />
        <div className="detail-not-found">
          <p>Transaction not found</p>
          <Button onClick={() => navigate('/transactions')}>Back to transactions</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Transaction Detail" />
      <div className="detail-page">
        <Button variant="secondary" onClick={() => navigate('/transactions')}>← Back</Button>
        <Card variant="default" className="detail-card">
          <div className="detail-header">
            <div className="detail-amount-section">
              <span className="detail-type-badge">
                <Badge variant={tx.type === 'income' ? 'success' : 'default'}>{tx.type === 'income' ? 'Income' : 'Expense'}</Badge>
              </span>
              <span className={`detail-amount ${tx.type === 'income' ? 'positive' : ''}`}>
                {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount, selectedCurrency)}
              </span>
            </div>
            <div className="detail-actions">
              <Button variant="danger" onClick={() => { deleteTransaction(tx.id); toast('Transaction deleted', 'info'); navigate('/transactions'); }}>Delete</Button>
            </div>
          </div>

          <div className="detail-fields">
            <div className="detail-field">
              <span className="detail-label">Description</span>
              <span className="detail-value">{tx.description}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Date</span>
              <span className="detail-value">{formatDate(tx.date)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Category</span>
              <span className="detail-value">{tx.category}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Account</span>
              <span className="detail-value">{account?.name || '—'}</span>
            </div>
            {tx.notes && (
              <div className="detail-field">
                <span className="detail-label">Notes</span>
                <span className="detail-value">{tx.notes}</span>
              </div>
            )}
            {tx.tags && tx.tags.length > 0 && (
              <div className="detail-field">
                <span className="detail-label">Tags</span>
                <div className="detail-tags">
                  {tx.tags.map(tag => <Badge key={tag} variant="info">{tag}</Badge>)}
                </div>
              </div>
            )}
            {tx.isSplit && tx.splits && tx.splits.length > 0 && (
              <div className="detail-field">
                <span className="detail-label">Splits</span>
                <div className="detail-splits">
                  {tx.splits.map((s, i) => (
                    <div key={i} className="detail-split-row">
                      <span>{s.category}</span>
                      <span className="split-amount">{formatCurrency(s.amount, selectedCurrency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
