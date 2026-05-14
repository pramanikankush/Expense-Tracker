# Expense Tracker App - Detailed Plan Overview

## 1. Purpose and Product Goals
- Help users understand and control spending with low-friction tracking.
- Provide budgeting and forecasting to improve financial decisions.
- Reduce manual work through rules, recurring entries, and imports.

## 2. Target Users
- Individuals managing personal finances.
- Households sharing budgets and accounts.
- Freelancers who need category clarity and exportable reports.

## 3. Design System Alignment (Cohere-design-analysis)
### Visual Direction
- White editorial canvas with restrained UI chrome.
- Dark feature bands in deep green or dark navy.
- Rounded media surfaces (8px-22px); avoid heavy shadows.

### Typography
- Display: CohereText (fallback Space Grotesk/Inter).
- Body/UI: Unica77 Cohere Web (fallback Inter/Arial).
- Labels: CohereMono for system markers and filter tags.

### Color Usage
- Primary CTA: near-black #17171c on white.
- Accent bands: deep green #003c33 and dark navy #071829.
- Editorial accents: coral #ff7759 for taxonomy chips only.
- Links: action blue #1863dc.

### Components (mapped)
- Primary CTA: button-primary pill.
- Secondary actions: button-secondary text links.
- Filters/tags: button-pill-outline.
- Transaction list: research-table with hairline rules.
- Budget/goal cards: product-card on soft-stone.
- Highlights: dark-feature-band for alerts and summary blocks.

## 4. Core Feature Set (Loaded)
- Transactions: manual entry, bulk edit, split, receipts.
- Import: CSV, category mapping, duplicate detection.
- Categories and Tags: hierarchy, presets, tagging rules.
- Budgets: envelopes, rollovers, alerts, forecasts.
- Recurring: bills/income schedules, auto-post, reminders.
- Reports: category spend, trends, cashflow, net worth.
- Accounts: multiple accounts, transfers, archive.
- Goals: savings goals with timeline.
- Multi-currency: base currency plus FX rollups.
- Collaboration: shared household accounts with roles.
- Export/Backup: CSV/PDF, scheduled exports.

## 5. Information Architecture
- Primary nav: Dashboard, Transactions, Budgets, Reports, Goals, Settings.
- Secondary nav: Accounts, Categories, Recurring, Import/Export, Rules.
- Entity map: User -> Accounts -> Transactions -> Categories/Tags -> Budgets -> Reports/Goals.

## 6. Key UX Flows
- Onboarding: currency -> accounts -> import -> first budget.
- Quick add: compact pill CTA -> smart defaults.
- Budgeting: category selection -> limit -> alerts -> rollover impact.
- Recurring: schedule plus auto-post plus reminder window.
- Insights: dashboard KPI -> filtered report view.

## 7. Screen Inventory
- Dashboard: KPIs, budget health, cashflow chart, recent activity.
- Transactions: research-table list plus filters plus bulk tools.
- Transaction detail: split editor, tags, receipt.
- Budgets: product-card grid plus dark feature band for warnings.
- Reports: chart sets plus export controls.
- Goals: progress cards plus timeline targets.
- Accounts: balances and transfers.
- Settings: profile, security, currency, export, collaboration.

## 8. Data Model (High-Level)
- User: preferences, base currency, timezone, security.
- Account: type, balance, status, institution metadata.
- Transaction: amount, date, category, tags, split, receipt.
- Budget: period, category, limit, rollover, alerts.
- Recurring: schedule, rule, next occurrence, auto-post.
- Goal: target, timeline, funding source.
- FX Rate: date, base, rates.

## 9. Architecture (Web First)
- Frontend: component library aligned to DESIGN.md, responsive grid.
- State: global store for transactions, budgets, filters.
- Backend: REST or GraphQL, scheduled jobs for recurring.
- Database: normalized tables for transactions, budgets, recurring.

## 10. Milestones
1. Design tokens and components aligned to DESIGN.md.
2. MVP: accounts plus transactions plus categories plus dashboard.
3. Budgets plus recurring with alerts.
4. Reports plus exports plus goals.
5. Advanced: multi-currency, collaboration, security.

## 11. Quality and Accessibility
- Tests for budget math, rollovers, FX conversions.
- Accessibility: focus states, contrast checks.
- Performance: list virtualization for large transaction sets.

## 12. Risks and Mitigations
- Data accuracy: validation plus duplicate detection.
- Overload: progressive disclosure in UI.
- Scope creep: feature flags for advanced modules.
