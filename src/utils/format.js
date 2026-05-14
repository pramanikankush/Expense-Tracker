const currencyFormatter = (currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 });

export function formatCurrency(amount, currency = 'USD') {
  return currencyFormatter(currency).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric',
  }).format(new Date(date));
}

export function formatMonth(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long', year: 'numeric',
  }).format(new Date(date));
}

export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function daysUntil(date) {
  const now = new Date();
  const target = new Date(date);
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isOverdue(date) {
  return new Date(date) < new Date();
}

export function generateId() {
  return crypto.randomUUID();
}

export function truncate(str, len = 30) {
  if (str.length <= len) return str;
  return str.slice(0, len) + '...';
}
