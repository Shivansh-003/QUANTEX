# QUANTEX — Market Model & Microstructure Specification

**Document Version:** 1.0.0  
**Status:** Canonical Specification  
**Classification:** Market Microstructure, Agent-Based Dynamics & Simulation Contract  

---

## 1. Real Market Foundations

### 1.1 Empirical Market Taxonomy
In the empirical domain, QUANTEX represents financial markets through a formal ontological hierarchy:

- **Exchange:** The physical or electronic matching facility (e.g., NASDAQ, NYSE, NSE, CME) with discrete operating rules, trading calendars, trading sessions (Pre-market, Continuous Trading, Post-market / Closing Cross), and tick-size regimes.
- **Asset:** The underlying economic entity or commodity (e.g., Apple Inc., S&P 500 Index, Crude Oil).
- **Instrument:** The tradable financial contract referencing an Asset (e.g., Equity Common Stock, Options Contract, Futures Contract, ETF).
- **Price Concepts:**
  - **Best Bid ($P_b$) / Best Ask ($P_a$):** Highest price a buyer is willing to pay and lowest price a seller is willing to accept.
  - **Mid Price ($P_{\text{mid}}$):** $\frac{P_a + P_b}{2}$
  - **Micro-Price ($P_{\text{micro}}$):** Volume-weighted mid price:
    $$P_{\text{micro}} = \frac{Q_b P_a + Q_a P_b}{Q_b + Q_a}$$
  - **Last Traded Price ($P_{\text{last}}$):** Price of the most recent matched execution.
- **OHLCV Aggregation:** Discrete-time price and volume summaries across fixed time horizons $\Delta t$ containing: Open ($O_t$), High ($H_t$), Low ($L_t$), Close ($C_t$), Volume ($V_t$), and Volume-Weighted Average Price ($\text{VWAP}_t$).

---

## 2. Synthetic Market & Stochastic Processes

To conduct controlled quantitative experiments, QUANTEX defines a synthetic market simulation framework.

> [!NOTE]
> The stochastic models below serve as baseline research abstractions. They provide controlled generative processes for microstructure and agent experimentation.

### 2.1 Latent Fundamental Value Process
The synthetic asset has an unobserved fundamental value $V_t$ that evolves via arithmetic or geometric Brownian motion with discrete informational jumps:

$$V_t = V_{t-1} + \mu \Delta t + \sigma_V \sqrt{\Delta t} \, \epsilon_t + J_t$$

Where:
- $\mu$: Fundamental drift
- $\sigma_V$: Fundamental volatility
- $\epsilon_t \sim \mathcal{N}(0, 1)$: Gaussian innovation
- $J_t$: Poisson jump process modeling discrete news events:
  $$J_t = \sum_{k=1}^{N_t} Y_k, \quad N_t \sim \text{Poisson}(\lambda \Delta t), \quad Y_k \sim \mathcal{N}(\mu_J, \sigma_J^2)$$

### 2.2 Market Price Formation
The observed market price $P_t$ emerges endogenously from the interaction of heterogeneous agents submitting limit and market orders into the Limit Order Book. The deviation $(P_t - V_t)$ reflects market mispricing, liquidity friction, and noise.

---

## 3. Event-Driven Market Microstructure Architecture

All synthetic market simulation and historical backtesting in QUANTEX operate under a discrete-event simulation paradigm:

```text
       ┌─────────────────────────────────────────────────────────┐
       │                   MARKET EVENT                          │
       │  (Timer Tick, Macro News, Order Book State Change, etc.)│
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                   AGENT OBSERVATION                     │
       │  (Agent filters market state via its Information Tier)   │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                   AGENT DECISION                        │
       │  (Belief update, utility maximization, rule evaluation)  │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                   ORDER SUBMISSION                      │
       │  (Limit Order, Market Order, Cancel, Replace)           │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                   MATCHING ENGINE                       │
       │  (Continuous Double Auction, Priority Queue Execution)  │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                   TRADE EXECUTION                       │
       │  (Price discovery, volume fill, cash/inventory update)  │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                 MARKET STATE UPDATE                     │
       │  (LOB depth broadcast, trade tape stream, bar rollup)   │
       └─────────────────────────────────────────────────────────┘
```

---

## 4. Heterogeneous Agent Taxonomy

QUANTEX simulates market ecosystems by instantiating populations of autonomous agents with diverse utility functions, time horizons, and information access:

```
┌──────────────────┬──────────────────────────────────────────────────────────────────────────────┐
│ Agent Type       │ Behavioral Heuristic & Mechanism                                             │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ 1. Noise Trader  │ Submits stochastic buy/sell orders uncorrelated with fundamentals. Models     │
│                  │ uncoordinated liquidity and exogenous order flow noise.                      │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ 2. Value Trader  │ Compares perceived fundamental value $V_t$ to market price $P_t$. Buys when  │
│                  │ $P_t < V_t - \delta$, sells when $P_t > V_t + \delta$ (mean-reversion force).│
├──────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ 3. Momentum      │ Follows short-term price trends: $\text{Signal}_t = \text{EMA}_{\text{fast}} │
│    Trader        │ - \text{EMA}_{\text{slow}}$. Amplifies trends and creates autocorrelation.   │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ 4. Mean-         │ Trades Bollinger Band and Z-score extremes, providing liquidity when price   │
│    Reversion     │ deviates significantly from rolling local equilibrium.                       │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ 5. Arbitrageur   │ Exploits synthetic cross-venue discrepancies or pricing divergence between   │
│                  │ synthetic synthetic index and component baskets.                             │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ 6. Market Maker  │ Places two-sided limit orders around mid-price using Avellaneda-Stoikov      │
│                  │ inventory control: $r(s, q) = s - q \gamma \sigma^2 (T - t)$.                │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ 7. Informed      │ Receives high-fidelity, low-latency observations of true fundamental $V_t$.  │
│    Trader        │ Optimizes trade sizing to minimize market impact (Kyle's model).             │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ 8. RL Trader     │ Deep Q-Network or PPO reinforcement learning agent optimizing execution      │
│                  │ or cumulative risk-adjusted PnL under dynamic reward functions.             │
└──────────────────┴──────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Information Asymmetry Framework

QUANTEX features an asymmetric information engine to model how uneven information dissemination influences order book dynamics, adverse selection, and price discovery.

```text
                        TRUE FUNDAMENTAL VALUE (V_t)
                                     │
                        INFORMATION ENGINE DISPATCH
                                     │
             ┌───────────────────────┼───────────────────────┐
             ▼                       ▼                       ▼
      TIER A (Informed)       TIER B (Semi-Informed)   TIER C (Uninformed)
      - Exact Value (100%)    - Noisy Value (60%)      - Delayed/Noisy (10%)
      - Latency: 0ms          - Latency: 250ms         - Latency: 1000ms
      - Observation:          - Observation:           - Observation:
        S_A(t) = V(t)           S_B(t) = V(t-Δ1)+η_B     S_C(t) = V(t-Δ2)+η_C
```

### 5.1 Microstructure Effects of Information Asymmetry
- **Adverse Selection:** Uninformed market makers face toxic order flow when quoting against Tier A informed traders, leading to wider equilibrium bid-ask spreads.
- **Kyle's Lambda ($\lambda$):**
  $$P_{t+1} - P_t = \lambda \cdot Q_t + \eta_t$$
  Where $Q_t$ is net order flow. QUANTEX measures how $\lambda$ expands as the proportion of Tier A agents increases.

---

## 6. Limit Order Book (LOB) Specification

The QUANTEX LOB is a deterministic continuous double auction order matching engine.

### 6.1 Order Book Structure & Price Levels
- **Bids:** Ordered descending by price: $P_{b, 1} > P_{b, 2} > \dots > P_{b, K}$.
- **Asks:** Ordered ascending by price: $P_{a, 1} < P_{a, 2} < \dots < P_{a, K}$.
- **Queue Priority:** Price-Time Priority (FIFO) within each discrete price tick level.

```
                  ASKS (Sellers)
      Level 3:  $100.05  │  Qty: 500  [Order#103 (300), Order#107 (200)]
      Level 2:  $100.04  │  Qty: 350  [Order#101 (350)]
      Level 1:  $100.03  │  Qty: 100  [Order#099 (100)]  <-- Best Ask
────────────────────────────────────────────────────────
      Spread:   $0.02    │  Mid: $100.02
────────────────────────────────────────────────────────
      Level 1:  $100.01  │  Qty: 250  [Order#098 (250)]  <-- Best Bid
      Level 2:  $100.00  │  Qty: 800  [Order#094 (500), Order#096 (300)]
      Level 3:  $99.98   │  Qty: 1200 [Order#090 (1200)]
                  BIDS (Buyers)
```

### 6.2 Matching & Execution Semantics
- **Order Types Supported:**
  - **Limit Order:** Rest on book if not immediately fillable at limit price or better.
  - **Market Order:** Sweeps opposite book levels until fully filled or liquidity exhausted.
  - **Immediate-Or-Cancel (IOC):** Fills available liquidity immediately; cancels remainder.
  - **Fill-Or-Kill (FOK):** Executes full quantity immediately or cancels entire order.
- **Partial Fills:** Orders match against queue heads; matched volume decrements queue quantity while preserving remaining queue positions.
- **Cancellations & Modifications:** Order cancellation removes the specific order from the queue in $O(1)$ time; size reduction preserves queue priority; price change moves order to the tail of the new price queue.
