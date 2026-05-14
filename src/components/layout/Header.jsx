import { useStore } from '../../data/store';
import { formatCurrency } from '../../utils/format';
import { netWorth } from '../../utils/calculations';
import './Header.css';

export default function Header({ title, subtitle }) {
  const { state } = useStore();
  const worth = netWorth(state.accounts);

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
      <div className="header-right">
        <div className="header-stat">
          <span className="header-stat-label">Net Worth</span>
          <span className="header-stat-value">{formatCurrency(worth, state.selectedCurrency)}</span>
        </div>
        <div className="header-stat">
          <span className="header-stat-label">Accounts</span>
          <span className="header-stat-value">{state.accounts.length}</span>
        </div>
      </div>
    </header>
  );
}
