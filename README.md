# Expense Tracker

A feature-rich expense tracking application built with React, Vite, and Recharts. Designed with a clean, editorial UI inspired by Cohere's design system.

## Features

- **Dashboard** — KPI overview, income vs expenses bar chart, spending by category pie chart, budget health, recent transactions, savings goals
- **Transactions** — Full CRUD, search/filter/sort, CSV import/export, split transactions, receipt support, bulk delete
- **Budgets** — Category-based envelopes, real-time spend tracking, rollover support, alerts, overspend warnings
- **Reports** — Cashflow area chart, category breakdown bar chart, net trend line, configurable date range
- **Goals** — Savings goal tracking with progress bars and direct contribution
- **Accounts** — Multiple account types (checking, savings, credit, cash), balance tracking, transfers
- **Settings** — Profile, base currency, security toggles (2FA, PIN), CSV export, categories & tags management

## Tech Stack

- **React 18** — UI framework
- **Vite 6** — Build tool
- **React Router 6** — Client-side routing
- **Recharts** — Charting library
- **CSS Custom Properties** — Design token system

## Design System

The UI follows a restrained editorial design language:
- White canvas with dark feature bands (deep green, dark navy)
- Near-black pill CTAs, text-only secondary actions
- Rounded media surfaces (8px–22px), no heavy shadows
- Coral for taxonomy chips only; blue for links
- Typography: CohereText (display), Unica77 (UI/body), CohereMono (labels)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
npm run preview
```

## License

MIT
