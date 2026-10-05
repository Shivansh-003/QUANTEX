# QUANTEX — User Interface & Design System Specification

**Document Version:** 1.0.0  
**Status:** Canonical Specification  
**Classification:** Design System, Ergonomics & Frontend Interface Contract  

---

## 1. Design Philosophy & Aesthetic Principles

### 1.1 Aesthetic Language: Institutional Quant Terminal + Modern Fintech
QUANTEX combines the dense information hierarchy, keyboard efficiency, and precision of institutional financial terminals with the crisp typography, accessibility, and component architecture of modern fintech engineering.

### 1.2 Explicit Anti-Patterns & Visual Constraints
- **Zero Excessive Gradients & Glows:** No distracting neon glows, glassmorphism, or low-contrast decorative backgrounds.
- **Zero Generic Dashboard-Card Bloat:** Avoid low-density cards that force excessive vertical scrolling. Prioritize tabular density and split panes.
- **Explainable Visual Data:** Every analytical component features explicit data labels, timestamps, and parameters.
- **Strict Semantic Color Discipline:** Green (`#10B981` / `#059669`) and Red (`#EF4444` / `#DC2626`) are reserved strictly for directional price movements, PnL, and order flow. Neutral slate/zinc grays govern backgrounds and chrome.

---

## 2. Design System Tokens & Typography

### 2.1 Color Palette
- **Backgrounds:**
  - `bg-terminal-primary`: `#090A0F` (Deep void black for primary workspace)
  - `bg-terminal-secondary`: `#12141C` (Panel background)
  - `bg-terminal-elevated`: `#1A1D27` (Dropdowns, modals, popovers)
- **Borders & Dividers:**
  - `border-terminal`: `#242838` (Subtle 1px structural grid lines)
- **Text & Typography:**
  - `text-primary`: `#F3F4F6` (High contrast primary data)
  - `text-secondary`: `#9CA3AF` (Labels, axis titles, secondary metadata)
  - `text-muted`: `#6B7280` (Timestamps, provenance hashes)
- **Financial Status & Direction:**
  - `bull-green`: `#10B981` (Price increase, long signals, positive PnL)
  - `bear-red`: `#EF4444` (Price decrease, short signals, drawdown)
  - `accent-cyan`: `#06B6D4` (Interactive focus, active tabs, selected states)
  - `accent-amber`: `#F59E0B` (Warnings, moderate risk, pending orders)

### 2.2 Typography Hierarchy
- **Font Families:**
  - UI Text: Inter / Geist Sans (Clear legibility at small sizes).
  - Numeric & Financial Data: JetBrains Mono / Roboto Mono with **tabular figures (`tnum`)** enabled to eliminate layout shifts during real-time streaming updates.
- **Scale:**
  - Data Values / Tables: `12px` / `13px` (Dense, tabular layout).
  - Component Headers: `14px` (Semibold).
  - Page Titles / Metrics: `20px` - `28px` (Bold).

---

## 3. Global Shell & Navigation Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [QUANTEX]  Markets | Screener | Research | Portfolio | Backtest | Paper | Sim | Risk   │ [Cmd+K] [User]
├───────────┬────────────────────────────────────────────────────────────────────────────┤
│ SIDEBAR   │ MAIN WORKSPACE VIEWPORT                                                    │
│ (Collaps- │ (Multi-pane grid layout with draggable/resizable dividers)                 │
│  ible)    │                                                                            │
│           │                                                                            │
│           │                                                                            │
├───────────┴────────────────────────────────────────────────────────────────────────────┤
│ STATUS BAR: Stream: Connected (12ms) │ Active Sim: Idle │ Memory: 42MB │ Data: v1.4.2  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Primary Navigation Items
1. **Overview:** Global macro summary, major indices, sector rotation heatmap, market breadth.
2. **Markets:** Multi-asset candlestick charting, Level 2 depth, trade tape, live order book.
3. **Discover:** Quantitative momentum metrics, factor movers, statistical breakout anomalies.
4. **Screener:** Multi-factor point-in-time filter engine with query builder.
5. **Asset Research:** Security view (Financials, DCF Valuation, Multiples, Ratios, News).
6. **Portfolio:** Holdings ledger, transaction log, sector exposure, performance attribution.
7. **Strategy Lab:** Strategy definition interface, signal combiner, parameter schema builder.
8. **Backtesting:** Event-driven simulation runner, walk-forward cross-validation, tear sheets.
9. **Paper Trading:** Virtual capital order routing desk, active orders, live fill logs.
10. **Market Simulator:** Multi-agent continuous double auction LOB sandbox, playback controls.
11. **Risk:** Portfolio VaR/CVaR, factor stress-testing, drawdown duration, tail risk.
12. **Experiments:** Research notebook workspace, hypothesis registry, dataset versioning.
13. **Research:** AI Research Analyst memo studio, factor decay reports, publication export.

### 3.2 Global Command Palette (`Cmd+K` / `Ctrl+K`)
- Instant keyboard search across tickers, instruments, pages, strategy templates, and quick actions (e.g., `> Submit Paper Order`, `> Run DCF AAPL`).

---

## 4. Major Page Layouts & Component Specifications

### 4.1 Market Terminal (`/markets`)
- **Purpose:** Market surveillance and technical chart analysis.
- **User Actions:** Change timeframes, toggle technical overlays (SMA, Bollinger, RSI), inspect L2 book depth, view trade tape.
- **Data Displayed:** Real-time ticker stream, Level 2 bid/ask ladders, volume delta, order flow imbalance.
- **Charts:** Interactive candlestick chart (Candlesticks + Volume + Sub-indicator pane for RSI/MACD), Order Book Depth Chart.
- **States:**
  - *Loading:* Skeleton chart grid and shimmer pulse on order ladders.
  - *Empty:* "Select an active instrument or search in Command Palette."
  - *Error:* Reconnecting banner with exponential backoff retry counter.

### 4.2 Quant Screener (`/screener`)
- **Purpose:** Systematic asset filtering across technical, fundamental, and risk metrics.
- **User Actions:** Add/remove filter rules, adjust numeric thresholds, sort columns, export CSV, save preset.
- **Data Displayed:** Dense tabular grid with sticky headers, pagination, column sorting, and inline sparklines.
- **States:**
  - *Loading:* Shimmering table rows.
  - *Empty:* "No securities match the selected filter criteria. Try widening your thresholds."
  - *Error:* Clear error modal indicating invalid syntax or backend query timeout.

### 4.3 Asset Research & Intrinsic Valuation (`/research/[symbol]`)
- **Purpose:** Fundamental investigation, financial ratio breakdown, and interactive DCF valuation.
- **User Actions:** Adjust DCF growth sliders, toggle peer group benchmarks, inspect multi-year financial statements.
- **Data Displayed:** 
  - Standardized Income Statement, Balance Sheet, Cash Flow tables.
  - Valuation Range Card displaying P10 (Conservative), P50 (Base Fair Value), P90 (Optimistic).
  - Factor score breakdown with explainable contribution bars.
- **Charts:** Monte Carlo Fair-Value Probability Density curve, Historical P/E and EV/EBITDA valuation bands.

### 4.4 Strategy Lab & Backtesting (`/backtest`)
- **Purpose:** Codify systematic trading rules and execute event-driven backtests.
- **User Actions:** Select strategy, choose pinned dataset version, set fee/slippage assumptions, run backtest.
- **Data Displayed:** Interactive tear sheet, Sharpe/Sortino/Calmar summary cards, trade execution ledger.
- **Charts:** Cumulative Equity Curve vs. Benchmark, Underwater Drawdown Chart, Monthly Returns Heatmap.

### 4.5 Market Simulator & Asymmetric Arena (`/simulator`)
- **Purpose:** Run multi-agent continuous double auction experiments and asymmetric information scenarios.
- **User Actions:** Configure agent populations (Noise, Value, Momentum, Market Maker, Informed), set information tier parameters, step/pause simulation clock, submit manual orders into synthetic book.
- **Data Displayed:** Synthetic LOB depth, agent inventory distribution, cumulative Kyle's lambda price impact.
- **Charts:** Price vs. Fundamental Value trajectory, Real-time Order Book Heatmap, Agent Wealth Distribution bar chart.

---

## 5. Responsive Behavior & Accessibility (WCAG 2.1 AA)

1. **Responsive Viewport Breakpoints:**
   - Desktop Large (`>= 1440px`): Full multi-pane 4-column layout (Chart, LOB, Tape, Order Ticket).
   - Desktop Standard (`1024px - 1439px`): 3-column layout with tabbed sidebars.
   - Tablet (`768px - 1023px`): 2-column stacked layout with collapsible navigation.
   - Mobile (`< 768px`): Focused single-pane navigation with swipeable tabs (optimized for portfolio review and screener reading).
2. **Keyboard Ergonomics:**
   - Full keyboard navigation for order entry, symbol switching, and table pagination (`J`/`K` for row navigation, `Enter` to open, `/` to focus search).
3. **Accessibility Standards:**
   - Minimum color contrast ratio of `4.5:1` for standard text and `3:1` for large numerical metrics against dark backgrounds.
   - Screen-reader accessible ARIA roles on all interactive charts, tables, and modal dialogs.
