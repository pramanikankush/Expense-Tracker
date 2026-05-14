import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { SAMPLE_CATEGORIES, SAMPLE_TAGS } from './sampleData';
import { generateId } from '../utils/format';

const StoreContext = createContext(null);

const STORAGE_KEY = 'expense-tracker-data';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    user: { name: '', email: '', baseCurrency: 'USD', timezone: 'UTC', twoFactorEnabled: false, pinEnabled: false, exportFrequency: 'never' },
    accounts: [],
    transactions: [],
    categories: SAMPLE_CATEGORIES,
    budgets: [],
    recurring: [],
    goals: [],
    tags: SAMPLE_TAGS,
    exchangeRates: { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.12, JPY: 149.50 },
    selectedCurrency: 'USD',
    theme: 'light',
  };
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const tx = { ...action.payload, id: generateId(), createdAt: new Date().toISOString() };
      const accounts = state.accounts.map(a =>
        a.id === tx.account
          ? { ...a, balance: a.balance + tx.amount }
          : a
      );
      return { ...state, transactions: [tx, ...state.transactions], accounts };
    }
    case 'UPDATE_TRANSACTION': {
      const oldTx = state.transactions.find(t => t.id === action.payload.id);
      const { id, ...changes } = action.payload;
      const transactions = state.transactions.map(t =>
        t.id === id ? { ...t, ...changes } : t
      );
      let accounts = state.accounts;
      if (oldTx) {
        const oldAmount = oldTx.amount;
        const newAmount = changes.amount !== undefined ? changes.amount : oldAmount;
        const oldAccount = changes.account !== undefined ? changes.account : oldTx.account;
        const newAccount = changes.account !== undefined ? changes.account : oldTx.account;
        const amountDiff = newAmount - oldAmount;
        accounts = accounts.map(a => {
          if (a.id === oldAccount && a.id === newAccount) {
            return { ...a, balance: a.balance + amountDiff };
          }
          if (a.id === oldAccount) {
            return { ...a, balance: a.balance - oldAmount };
          }
          if (a.id === newAccount) {
            return { ...a, balance: a.balance + newAmount };
          }
          return a;
        });
      }
      return { ...state, transactions, accounts };
    }
    case 'DELETE_TRANSACTION': {
      const tx = state.transactions.find(t => t.id === action.id);
      const accounts = tx
        ? state.accounts.map(a =>
            a.id === tx.account
              ? { ...a, balance: a.balance - tx.amount }
              : a
          )
        : state.accounts;
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.id), accounts };
    }
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, { ...action.payload, id: generateId() }] };
    case 'UPDATE_ACCOUNT': {
      const accounts = state.accounts.map(a =>
        a.id === action.payload.id ? { ...a, ...action.payload } : a
      );
      return { ...state, accounts };
    }
    case 'DELETE_ACCOUNT':
      return { ...state, accounts: state.accounts.filter(a => a.id !== action.id) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, { ...action.payload, id: generateId() }] };
    case 'UPDATE_CATEGORY': {
      const categories = state.categories.map(c =>
        c.id === action.payload.id ? { ...c, ...action.payload } : c
      );
      return { ...state, categories };
    }
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.id) };
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, { ...action.payload, id: generateId() }] };
    case 'UPDATE_BUDGET': {
      const budgets = state.budgets.map(b =>
        b.id === action.payload.id ? { ...b, ...action.payload } : b
      );
      return { ...state, budgets };
    }
    case 'DELETE_BUDGET':
      return { ...state, budgets: state.budgets.filter(b => b.id !== action.id) };
    case 'ADD_RECURRING':
      return { ...state, recurring: [...state.recurring, { ...action.payload, id: generateId() }] };
    case 'UPDATE_RECURRING': {
      const recurring = state.recurring.map(r =>
        r.id === action.payload.id ? { ...r, ...action.payload } : r
      );
      return { ...state, recurring };
    }
    case 'DELETE_RECURRING':
      return { ...state, recurring: state.recurring.filter(r => r.id !== action.id) };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, { ...action.payload, id: generateId() }] };
    case 'UPDATE_GOAL':
      return { ...state, goals: state.goals.map(g => g.id === action.payload.id ? { ...g, ...action.payload } : g) };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.id) };
    case 'TRANSFER': {
      const accounts = state.accounts.map(a => {
        if (a.id === action.payload.from) return { ...a, balance: a.balance - action.payload.amount };
        if (a.id === action.payload.to) return { ...a, balance: a.balance + action.payload.amount };
        return a;
      });
      return { ...state, accounts };
    }
    case 'IMPORT_TRANSACTIONS':
      return { ...state, transactions: [...action.payload, ...state.transactions] };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'SET_CURRENCY':
      return { ...state, selectedCurrency: action.payload };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addTransaction = useCallback((tx) => dispatch({ type: 'ADD_TRANSACTION', payload: tx }), []);
  const updateTransaction = useCallback((tx) => dispatch({ type: 'UPDATE_TRANSACTION', payload: tx }), []);
  const deleteTransaction = useCallback((id) => dispatch({ type: 'DELETE_TRANSACTION', id }), []);

  const addAccount = useCallback((a) => dispatch({ type: 'ADD_ACCOUNT', payload: a }), []);
  const updateAccount = useCallback((a) => dispatch({ type: 'UPDATE_ACCOUNT', payload: a }), []);
  const deleteAccount = useCallback((id) => dispatch({ type: 'DELETE_ACCOUNT', id }), []);

  const addCategory = useCallback((c) => dispatch({ type: 'ADD_CATEGORY', payload: c }), []);
  const updateCategory = useCallback((c) => dispatch({ type: 'UPDATE_CATEGORY', payload: c }), []);
  const deleteCategory = useCallback((id) => dispatch({ type: 'DELETE_CATEGORY', id }), []);

  const addBudget = useCallback((b) => dispatch({ type: 'ADD_BUDGET', payload: b }), []);
  const updateBudget = useCallback((b) => dispatch({ type: 'UPDATE_BUDGET', payload: b }), []);
  const deleteBudget = useCallback((id) => dispatch({ type: 'DELETE_BUDGET', id }), []);

  const addRecurring = useCallback((r) => dispatch({ type: 'ADD_RECURRING', payload: r }), []);
  const updateRecurring = useCallback((r) => dispatch({ type: 'UPDATE_RECURRING', payload: r }), []);
  const deleteRecurring = useCallback((id) => dispatch({ type: 'DELETE_RECURRING', id }), []);

  const addGoal = useCallback((g) => dispatch({ type: 'ADD_GOAL', payload: g }), []);
  const updateGoal = useCallback((g) => dispatch({ type: 'UPDATE_GOAL', payload: g }), []);
  const deleteGoal = useCallback((id) => dispatch({ type: 'DELETE_GOAL', id }), []);

  const transfer = useCallback((from, to, amount) =>
    dispatch({ type: 'TRANSFER', payload: { from, to, amount } }), []);

  const importTransactions = useCallback((txs) =>
    dispatch({ type: 'IMPORT_TRANSACTIONS', payload: txs }), []);

  const updateUser = useCallback((u) => dispatch({ type: 'UPDATE_USER', payload: u }), []);
  const setCurrency = useCallback((c) => dispatch({ type: 'SET_CURRENCY', payload: c }), []);

  const value = {
    state,
    addTransaction, updateTransaction, deleteTransaction,
    addAccount, updateAccount, deleteAccount,
    addCategory, updateCategory, deleteCategory,
    addBudget, updateBudget, deleteBudget,
    addRecurring, updateRecurring, deleteRecurring,
    addGoal, updateGoal, deleteGoal,
    transfer, importTransactions, updateUser, setCurrency,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
