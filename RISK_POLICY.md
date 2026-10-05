# QUANTEX — Risk Policy & Financial Safety Framework

**Document Version:** 1.0.0  
**Status:** Canonical Specification  
**Classification:** Institutional Risk Policy, Safety Boundaries & Governance Contract  

---

## 1. Executive Statement & Regulatory Demarcation

> [!CAUTION]
> **QUANTEX DOES NOT EXECUTE REAL-MONEY TRADES, HOLD USER FUNDS, OR PROVIDE FIDUCIARY INVESTMENT ADVICE.**
>
> All orders, balances, fills, and portfolio gains/losses rendered within the platform are **virtual, hypothetical, and for educational, analytical, and research purposes only.**

QUANTEX is an analytical software framework, simulation workbench, and quantitative research environment. No output from QUANTEX—whether a valuation model, a backtest tear sheet, a risk report, or an AI research memo—constitutes a solicitation, recommendation, endorsement, or offer to purchase or sell any financial security.

---

## 2. Institutional Risk Taxonomy

QUANTEX establishes a formal nine-domain risk taxonomy governing analytical models and simulation engines:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                 QUANTEX RISK TAXONOMY                                     │
├────────────────────────────┬──────────────────────────────────────────────────────────────┤
│ Risk Domain                │ Definition, Impact & Platform Containment                    │
├────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 1. Market Risk             │ Exposure to adverse asset price movements, broad market      │
│                            │ drawdowns, interest rate shifts, and volatility shocks.      │
├────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 2. Model Risk              │ Mathematical misspecification, erroneous parameter choices,  │
│                            │ flawed assumptions, or overfitting to historical artifacts.  │
├────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 3. Data Risk               │ Ingestion delays, missing corporate actions, unadjusted      │
│                            │ splits, vendor inaccuracies, or timestamp desynchronization. │
├────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 4. Execution Risk          │ Unrealistic fill assumptions, latency degradation, adverse  │
│                            │ queue positioning, or execution slippage in paper trading.   │
├────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 5. Liquidity Risk          │ Inability to unwind simulated positions without severe price │
│                            │ impact during market stress or volume contractions.          │
├────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 6. Concentration Risk      │ Over-allocation to individual single stocks, sectors,        │
│                            │ geographical regions, or single factor drivers.              │
├────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 7. Operational Risk        │ System downtime, database corruption, calculation latency,   │
│                            │ network partition, or memory overflows.                      │
├────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 8. Simulation Risk         │ False equivalence between agent-based synthetic markets and  │
│                            │ empirical real-world trading venues.                         │
├────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 9. AI & Explanation Risk   │ Ungrounded financial commentary or misleading narrative      │
│                            │ summaries by language models.                                │
└────────────────────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 3. Mandatory Risk Metrics & Interpretation Guidelines

Portfolio and backtest views in QUANTEX display standard risk metrics accompanied by explicit interpretation guidelines:

### 3.1 Downside & Tail Risk
- **Value at Risk (95% & 99% 1-Day VaR):** Maximum expected dollar or percentage loss over 1 day at the 95th/99th percentile under normal market conditions.
  *Interpretation:* If 95% 1-day VaR is $2.5\%$, on 1 out of 20 trading days, losses are expected to exceed $2.5\%$.
- **Conditional VaR / Expected Shortfall ($\text{CVaR}_{95}$):** Expected loss given that the loss exceeds the VaR threshold.
  *Interpretation:* Measures the average severity of extreme tail events.
- **Maximum Drawdown (MDD) & Underwater Duration:** Peak-to-trough decline in portfolio equity and number of trading days required to recover the previous peak.

### 3.2 Factor & Concentration Bounds
- **Single-Asset Concentration Cap:** Warns when any single position exceeds $15\%$ of total portfolio NAV.
- **Sector Concentration Cap:** Warns when any single GICS sector exceeds $35\%$ of total portfolio NAV.
- **Herfindahl-Hirschman Index (HHI):** Flags portfolios with $\text{HHI} > 0.20$ as highly concentrated.

---

## 4. Paper-Trading Guardrails & Execution Boundaries

To preserve execution realism and prevent distorted incentives in paper trading, the simulated broker enforces strict guardrails:

1. **No Instantaneous Zero-Cost Fills:** Market orders incur configurable execution latency (default $50\text{ ms}$) and must cross the simulated Level 2 spread.
2. **Participation Rate Volume Capping:** Simulated fills cannot exceed $10\%$ of actual historical bar volume at that minute, preventing unrealistic executions on illiquid securities.
3. **Short Selling & Borrow Cost Modeling:** Short positions require available borrow pools and accrue annualized borrow fees ($0.5\%$ to $25\%$ depending on asset borrow hardness).
4. **Margin & Collateral Requirements:** Leverage is capped at standard limits ($2:1$ intraday, $1:1$ overnight for retail paper accounts) with automated liquidation warnings when margin maintenance thresholds are breached.

---

## 5. AI Research Analyst Safety & Grounding Guardrails

To prevent language model hallucinations from polluting financial research:
1. **Strict Upstream Dependency:** The AI Research Analyst can only ingest and summarize computed numbers from the QUANTEX Quantitative and Risk Engines.
2. **Deterministic Citations:** Qualitative claims generated (e.g., "Company exhibits deteriorating liquidity") must cite the underlying calculated metric (e.g., `Current Ratio decreased from 1.8 to 1.1`).
3. **No Direct Trading Commands:** AI Analyst tools cannot autonomously submit orders or alter risk parameters without explicit human confirmation.
