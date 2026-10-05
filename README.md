# QUANTEX

## Quantitative Investment, Trading & Market Research Platform

[![Status](https://img.shields.io/badge/Status-Specification%20Complete-brightgreen)](#development-status)
[![License](https://img.shields.io/badge/License-Proprietary%20%2F%20Research-blue)](#license)
[![Architecture](https://img.shields.io/badge/Architecture-Event--Driven%20Microservices-orange)](#architecture--technology-stack)

> **QUANTEX** is an institutional-grade quantitative investment, trading, market research, portfolio intelligence, strategy lab, realistic backtesting, paper-trading, and market-simulation platform.

---

## 1. Product Overview & Vision

QUANTEX unifies empirical market analytics, rigorous fundamental/valuation intelligence, institutional risk modeling, event-driven backtesting, and agent-based market microstructure simulation into a single high-performance terminal.

The core guiding principle of QUANTEX is the unbroken causal continuum:

$$\textbf{Information} \longrightarrow \textbf{Belief} \longrightarrow \textbf{Decision} \longrightarrow \textbf{Trade} \longrightarrow \textbf{Outcome}$$

QUANTEX is designed for quantitative researchers, systematic strategy developers, portfolio managers, and students of finance who demand mathematical explainability, data provenance, and scientific rigor.

---

## 2. Core Capabilities Matrix

| Capability Domain | Description | Status |
| :--- | :--- | :--- |
| **Market Terminal** | High-performance multi-asset charts, L2/L3 order books, sector rotation, and market breadth. | `Planned` |
| **Quant Screener** | Point-in-time multi-factor filtering engine with custom mathematical expression evaluation. | `Planned` |
| **Fundamental & DCF Intelligence** | Standardized financial statements, Monte Carlo DCF valuation ranges, and peer multiples. | `Planned` |
| **Technical & Factor Signals** | Vectorized feature engineering (SMA, RSI, MACD, Bollinger, Z-Scores, Fama-French). | `Planned` |
| **Portfolio & Risk Intelligence** | Parametric/Historical VaR, CVaR/Expected Shortfall, Drawdowns, and factor risk models. | `Planned` |
| **Strategy Lab & Backtesting** | Institutional event-driven backtesting with slippage, transaction fees, and borrow costs. | `Planned` |
| **Realistic Paper Trading** | Virtual capital execution engine with latency simulation, queue priority, and margin checks. | `Planned` |
| **Market Microstructure & LOB** | Continuous double auction matching engine with Level 2/3 depth and order flow tracking. | `Planned` |
| **Agent-Based Market Simulation** | Heterogeneous agent populations (Noise, Value, Momentum, Market Maker, Informed). | `Planned` |
| **Asymmetric Information Arena** | Information distribution experiments (100% vs. 60% vs. 10% access tiers). | `Planned` |
| **Quant Research Lab & ML/RL** | Notebook-compatible experiments, regime detection (HMM), and Gym execution environments. | `Planned` |
| **AI Research Analyst** | Fact-grounded research memo generator operating downstream of quantitative engines. | `Planned` |

---

## 3. Architecture & Technology Stack

```text
                        QUANTEX
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
     MARKET DATA      QUANT ENGINE      SIMULATION
          │                │                │
          │          ┌─────┼─────┐          │
          │          ▼     ▼     ▼          │
          │      Valuation Risk Signals     │
          │          │     │     │          │
          └──────────┴─────┴─────┴──────────┘
                           │
                    ANALYTICS ENGINE
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
          Portfolio    Backtesting   Scenario
          Intelligence              Analysis
                           │
                    STRATEGY ENGINE
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
          Strategies     Paper       ML/RL
                         Trading     Research
                           │
                    MARKET SIMULATOR
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
            Agents        LOB      Information
                                    Asymmetry
                           │
                           ▼
                    QUANTEX TERMINAL
```

- **Frontend:** Next.js (App Router), React 19, TypeScript, TailwindCSS, TradingView Lightweight Charts, TanStack Query/Table, Zustand.
- **Backend & Compute:** Python 3.11+, FastAPI, NumPy, SciPy, Numba (JIT loops), Polars, Pandas.
- **Database & Timeseries:** PostgreSQL + TimescaleDB (Hypertables for OHLCV, ledger, financials).
- **High-Throughput Analytics:** ClickHouse / Apache Parquet (ticks, order book traces).
- **In-Memory & Streaming:** Redis 7.x (pub/sub, hot order books, L1 cache), Apache Kafka / Redpanda.
- **Infrastructure & Telemetry:** Docker, Kubernetes, OpenTelemetry, Prometheus, Grafana.

---

## 4. Development Status

| Status Category | Meaning | Scope |
| :--- | :--- | :--- |
| **Specification Complete** | System contracts, mathematical models, API schemas, and architecture established. | Core Platform Specification |
| **In Development** | Active engineering work under construction. | Production Foundation & Architecture Setup |
| **Planned** | Fully specified in roadmap, pending prerequisite completion. | Application Modules & Features |

---

## 5. Research & Simulation Philosophy

1. **Zero Look-Ahead & Survivorship Bias:** Point-in-time indexing and historical delisting inclusion are enforced across all datasets.
2. **Explainability Over Black Boxes:** No score or metric is output without its component decomposition and mathematical derivation.
3. **No False Precision:** Intrinsic valuations are reported as probabilistic confidence ranges (P10, P50, P90), not static point claims.
4. **Statistical Significance Testing:** Strategies are evaluated using the Deflated Sharpe Ratio (DSR), stationary bootstrap confidence intervals, and parameter stability surfaces.
5. **Execution Boundary:** Paper trading uses virtual capital only. QUANTEX does not connect to real-money execution venues.

---

## 6. Documentation Directory

- [`PROJECT_SPEC.md`](file:///c:/Users/shiva/OneDrive/Desktop/QuanteX/PROJECT_SPEC.md) — Comprehensive product vision, user personas, and product boundaries.
- [`ARCHITECTURE.md`](file:///c:/Users/shiva/OneDrive/Desktop/QuanteX/ARCHITECTURE.md) — Complete technical, microservices, and streaming architecture.
- [`DEVELOPMENT_PLAN.md`](file:///c:/Users/shiva/OneDrive/Desktop/QuanteX/DEVELOPMENT_PLAN.md) — Engineering roadmap and stage specifications.
- [`QUANT_SPECIFICATION.md`](file:///c:/Users/shiva/OneDrive/Desktop/QuanteX/QUANT_SPECIFICATION.md) — Mathematical formulations for metrics, indicators, DCF, and risk.
- [`MARKET_MODEL.md`](file:///c:/Users/shiva/OneDrive/Desktop/QuanteX/MARKET_MODEL.md) — Real & synthetic market dynamics, heterogeneous agents, and LOB rules.
- [`DATA_MODEL.md`](file:///c:/Users/shiva/OneDrive/Desktop/QuanteX/DATA_MODEL.md) — Canonical entities, field types, relationships, and data provenance.
- [`API_SPECIFICATION.md`](file:///c:/Users/shiva/OneDrive/Desktop/QuanteX/API_SPECIFICATION.md) — REST endpoints and WebSocket protocol specifications.
- [`UI_SPECIFICATION.md`](file:///c:/Users/shiva/OneDrive/Desktop/QuanteX/UI_SPECIFICATION.md) — Terminal design system, navigation, page layouts, and UX states.
- [`RESEARCH_METHODOLOGY.md`](file:///c:/Users/shiva/OneDrive/Desktop/QuanteX/RESEARCH_METHODOLOGY.md) — Anti-bias protocols, cross-validation, DSR, and experiment schemas.
- [`RISK_POLICY.md`](file:///c:/Users/shiva/OneDrive/Desktop/QuanteX/RISK_POLICY.md) — 9-domain risk taxonomy, paper-trading guardrails, and non-brokerage rules.
- [`SPECIFICATION_STATUS.md`](file:///c:/Users/shiva/OneDrive/Desktop/QuanteX/SPECIFICATION_STATUS.md) — Specification status and cross-document alignment summary.
