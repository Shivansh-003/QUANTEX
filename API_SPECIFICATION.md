# QUANTEX — API & Streaming Protocol Specification

**Document Version:** 1.0.0  
**Status:** Canonical Specification  
**Classification:** REST API & WebSocket Protocol Contract  

---

## 1. Global API Standards & Envelope Conventions

All synchronous REST endpoints adhere to OpenAPI 3.1 standards.

### 1.1 Response Envelope Format
Every successful response returns an HTTP 200/201/204 status with the following canonical JSON body:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-10-05T22:30:00.000000Z",
    "version": "v1.0.0",
    "provenance": {
      "source": "DATA_VENDOR_A",
      "data_version": "v1.4.2",
      "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  "error": null
}
```

### 1.2 Error Envelope Format
Errors return appropriate HTTP 4xx/5xx status codes with standard error structures:

```json
{
  "success": false,
  "data": null,
  "meta": {
    "timestamp": "2026-10-05T22:30:00.000000Z",
    "version": "v1.0.0"
  },
  "error": {
    "code": "RESOURCE_NOT_FOUND | VALIDATION_ERROR | RATE_LIMITED | UNAUTHORIZED",
    "message": "Human-readable description of error.",
    "details": [
      {
        "field": "wacc",
        "issue": "WACC must be strictly greater than terminal growth rate g."
      }
    ]
  }
}
```

---

## 2. REST API Domain Specifications

### 2.1 Health & Diagnostics
- **`GET /api/v1/health`**
  - *Purpose:* Liveness and health probe.
  - *Auth:* None.
  - *Output:* `{ "status": "UP", "services": { "db": "UP", "redis": "UP", "lob_engine": "UP" } }`

- **`GET /api/v1/version`**
  - *Purpose:* Returns system build hash, engine version, and calculation kernel versions.
  - *Auth:* None.

---

### 2.2 Market & Asset Data
- **`GET /api/v1/assets/search`**
  - *Purpose:* Search for assets by ticker, company name, or ISIN.
  - *Inputs:* `query` (string), `asset_class` (optional enum), `limit` (int default 20).
  - *Auth:* Optional.

- **`GET /api/v1/assets/{symbol}`**
  - *Purpose:* Retrieve asset master record, exchange metadata, and trading status.
  - *Inputs:* `symbol` (path string).
  - *Auth:* Optional.

- **`GET /api/v1/market/ohlcv/{symbol}`**
  - *Purpose:* Fetch historical OHLCV bars with provenance and split adjustment.
  - *Inputs:* `symbol` (path string), `timeframe` (enum `1m`, `5m`, `1h`, `1d`), `start` (timestamp), `end` (timestamp), `adjusted` (bool default true).
  - *Auth:* Optional.

---

### 2.3 Quantitative Screener
- **`POST /api/v1/screener/query`**
  - *Purpose:* Execute multi-factor, point-in-time quantitative filters over the asset universe.
  - *Inputs:*
    ```json
    {
      "as_of_date": "2025-12-31",
      "universe": "US_EQUITIES_LARGE_CAP",
      "filters": [
        { "field": "pe_ratio", "operator": "LTE", "value": 25.0 },
        { "field": "roic", "operator": "GTE", "value": 0.15 },
        { "field": "debt_to_equity", "operator": "LTE", "value": 1.0 },
        { "field": "rsi_14", "operator": "GTE", "value": 40.0 }
      ],
      "sort_by": "roic",
      "order": "DESC",
      "limit": 50,
      "offset": 0
    }
    ```
  - *Outputs:* Paginated array of matching assets with exact factor values and calculation dates.
  - *Auth:* Required.

---

### 2.4 Fundamental & Intrinsic Valuation
- **`GET /api/v1/fundamentals/{symbol}/statements`**
  - *Purpose:* Fetch standardized historical balance sheets, income statements, and cash flows.
  - *Inputs:* `symbol` (path string), `period` (enum `ANNUAL`, `QUARTERLY`), `limit` (int).
  - *Auth:* Required.

- **`POST /api/v1/valuation/{symbol}/dcf`**
  - *Purpose:* Run Monte Carlo sensitivity DCF model and return fair-value distribution.
  - *Inputs:*
    ```json
    {
      "forecast_years": 5,
      "growth_distribution": { "mean": 0.08, "std": 0.02 },
      "operating_margin_target": 0.22,
      "terminal_growth_range": [0.02, 0.035],
      "wacc_override": null,
      "monte_carlo_simulations": 10000
    }
    ```
  - *Outputs:*
    ```json
    {
      "fair_value_percentiles": { "p10": 142.50, "p50": 178.20, "p90": 215.80 },
      "wacc_computed": 0.0875,
      "margin_of_safety_p50": 0.142
    }
    ```
  - *Auth:* Required.

---

### 2.5 Quantitative Signals & Feature Engine
- **`GET /api/v1/signals/{symbol}/technical`**
  - *Purpose:* Retrieve vectorized technical features (SMA, EMA, RSI, MACD, ATR, Bollinger, Z-Score).
  - *Inputs:* `symbol` (path string), `timeframe` (enum), `indicators` (comma-separated list).
  - *Auth:* Required.

- **`GET /api/v1/signals/{symbol}/score`**
  - *Purpose:* Retrieve explainable multi-factor quant score with full component breakdown.
  - *Inputs:* `symbol` (path string), `score_type` (enum `QUALITY`, `VALUE`, `MOMENTUM`, `COMPOSITE`).
  - *Auth:* Required.

---

### 2.6 Risk Engine
- **`POST /api/v1/risk/portfolio/var`**
  - *Purpose:* Compute Parametric, Cornish-Fisher, and Historical VaR / Expected Shortfall.
  - *Inputs:* `portfolio_id` (UUID), `confidence` (float `0.95` or `0.99`), `horizon_days` (int default 1).
  - *Outputs:* VaR amount, CVaR amount, component percentage risk attribution per position.
  - *Auth:* Required.

---

### 2.7 Portfolio & Paper Trading Broker
- **`GET /api/v1/portfolio/{id}/summary`**
  - *Purpose:* Retrieve portfolio positions, cash balance, NAV, and performance attribution.
  - *Auth:* Required.

- **`POST /api/v1/paper/orders`**
  - *Purpose:* Submit a simulated paper trading order.
  - *Inputs:*
    ```json
    {
      "portfolio_id": "550e8400-e29b-41d4-a716-446655440000",
      "instrument_id": "770e8400-e29b-41d4-a716-446655440001",
      "side": "BUY",
      "order_type": "LIMIT",
      "quantity": 100.0,
      "limit_price": 175.50,
      "time_in_force": "GTC"
    }
    ```
  - *Auth:* Required.

---

### 2.8 Backtesting & Strategy Lab
- **`POST /api/v1/backtest/run`**
  - *Purpose:* Launch an event-driven backtesting simulation run.
  - *Inputs:* `strategy_id` (UUID), `dataset_version_id` (UUID), `start_date` (timestamp), `end_date` (timestamp), `slippage_bps` (float), `fee_bps` (float), `seed` (int).
  - *Outputs:* `backtest_run_id` (UUID) with asynchronous execution status.
  - *Auth:* Required.

- **`GET /api/v1/backtest/results/{run_id}`**
  - *Purpose:* Retrieve tear sheet, trade logs, and metrics for completed backtest.
  - *Auth:* Required.

---

### 2.9 Market Simulation & Asymmetric Arena
- **`POST /api/v1/simulation/create`**
  - *Purpose:* Initialize a multi-agent synthetic market simulation session.
  - *Inputs:*
    ```json
    {
      "name": "Asymmetric_Information_Experiment_01",
      "fundamental_process": { "initial_v": 100.0, "mu": 0.0, "sigma": 0.15, "jump_lambda": 0.01 },
      "agent_population": {
        "noise_traders": 50,
        "value_traders": 20,
        "momentum_traders": 15,
        "market_makers": 5,
        "informed_traders_tier_a": 5
      },
      "tick_interval_ms": 100
    }
    ```
  - *Auth:* Required.

- **`POST /api/v1/simulation/{id}/action`**
  - *Purpose:* Send control signal (`START`, `PAUSE`, `STEP`, `RESET`).
  - *Auth:* Required.

---

### 2.10 AI Research Analyst
- **`POST /api/v1/ai/analyst/memo`**
  - *Purpose:* Generate an explainable, fact-grounded research memo synthesizing quantitative and valuation data.
  - *Inputs:* `symbol` (string), `focus_areas` (array of `VALUATION`, `RISK`, `FINANCIAL_HEALTH`).
  - *Outputs:* Structured markdown research memo with explicit data reference links.
  - *Auth:* Required.

---

## 3. Real-Time Streaming WebSocket Protocol

All WebSocket connections connect to `wss://api.quantex.internal/v1/stream`.

### 3.1 Client Subscription Message Format
```json
{
  "action": "SUBSCRIBE",
  "channels": [
    "market:ticker:AAPL",
    "market:depth:AAPL",
    "paper:orders:550e8400-e29b-41d4-a716-446655440000",
    "sim:lob:sim_99182:SYNTH01"
  ]
}
```

### 3.2 Channel Payload Specifications

#### Channel: `market:ticker:{symbol}`
```json
{
  "topic": "market:ticker:AAPL",
  "type": "TICK",
  "data": {
    "symbol": "AAPL",
    "price": 178.45,
    "volume_24h": 54210900,
    "high_24h": 180.12,
    "low_24h": 177.30,
    "timestamp": "2026-10-05T22:30:00.123456Z"
  }
}
```

#### Channel: `market:depth:{symbol}` (Level 2 Delta)
```json
{
  "topic": "market:depth:AAPL",
  "type": "L2_DELTA",
  "data": {
    "sequence": 1049281,
    "bids": [[178.44, 500], [178.40, 1200]],
    "asks": [[178.46, 300], [178.50, 800]],
    "timestamp": "2026-10-05T22:30:00.123456Z"
  }
}
```

#### Channel: `sim:events:{simulationId}`
```json
{
  "topic": "sim:events:sim_99182",
  "type": "AGENT_EVENT",
  "data": {
    "event_id": "evt_001928",
    "agent_id": "agent_inf_01",
    "agent_tier": "TIER_A_100",
    "action": "SUBMIT_ORDER",
    "side": "BUY",
    "price": 101.50,
    "quantity": 50,
    "timestamp_ms": 14200
  }
}
```
