import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '◈' },
  { path: '/transactions', label: 'Transactions', icon: '↔' },
  { path: '/budgets', label: 'Budgets', icon: '◉' },
  { path: '/reports', label: 'Reports', icon: '▤' },
  { path: '/goals', label: 'Goals', icon: '◎' },
  { path: '/accounts', label: 'Accounts', icon: '▯' },
  { path: '/settings', label: 'Settings', icon: '⚙' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">$</span>
        <span className="sidebar-name">Expense Tracker</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-currency">USD</div>
      </div>
    </aside>
  );
}
