import { Routes, Route } from 'react-router-dom';
import { StoreProvider } from './data/store';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/layout/Layout';
import Dashboard from './screens/Dashboard';
import Transactions from './screens/Transactions';
import TransactionDetail from './screens/TransactionDetail';
import Budgets from './screens/Budgets';
import Reports from './screens/Reports';
import Goals from './screens/Goals';
import Accounts from './screens/Accounts';
import Settings from './screens/Settings';

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </ToastProvider>
    </StoreProvider>
  );
}
