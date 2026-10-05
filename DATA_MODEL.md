# QUANTEX — Canonical Data Model Specification

**Document Version:** 1.0.0  
**Status:** Canonical Specification  
**Classification:** Data Schema, Entity Relationship & Provenance Contract  

---

## 1. Global Data Standards & Conventions

1. **Identifier Standard:** All primary entity identifiers use universally unique identifiers (UUIDv4) formatted as lowercase strings (e.g., `550e8400-e29b-41d4-a716-446655440000`).
2. **Timestamp Standard:** All timestamps are serialized in ISO 8601 UTC with microsecond precision: `YYYY-MM-DDTHH:MM:SS.ffffffZ`.
3. **Monetary & Numeric Precision:**
   - Cash amounts, trade prices, and valuations must use fixed-point `Decimal` (minimum 18 digits precision, 8 decimal places: `DECIMAL(18, 8)`) to eliminate floating-point drift.
   - Quantities and shares support fractional units: `DECIMAL(18, 8)`.
   - Percentage returns and ratios are stored as pure decimals (e.g., `0.0525` for 5.25%): `DECIMAL(12, 8)`.
4. **Currencies:** Standard ISO 4217 three-letter currency codes (e.g., `USD`, `INR`, `EUR`, `GBP`).
5. **Data Provenance Metadata:** Every ingested and derived market, fundamental, or signal record embeds immutable provenance metadata:
   ```json
   {
     "source": "VENDOR_A | SEC_EDGAR | SYNTHETIC_ENGINE",
     "symbol": "AAPL",
     "timeframe": "1m | 1d | 1w",
     "ingestion_time": "2026-10-05T22:30:00.000000Z",
     "data_version": "v1.4.2",
     "checksum_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
   }
   ```

---

## 2. Core Entity Definitions

### 2.1 Market & Asset Entities

#### `Exchange`
- `id` (UUID): Unique exchange identifier.
- `mic` (String): ISO 10383 Market Identifier Code (e.g., `XNAS`, `XNYS`, `XNSE`).
- `name` (String): Full exchange name.
- `country` (String): ISO 3166-1 alpha-2 country code (e.g., `US`, `IN`).
- `timezone` (String): IANA timezone string (e.g., `America/New_York`, `Asia/Kolkata`).
- `currency` (String): Primary trading currency (ISO 4217).

#### `Asset`
- `id` (UUID): Unique asset identifier.
- `symbol` (String): Primary ticker symbol (e.g., `AAPL`, `RELIANCE`).
- `name` (String): Official legal corporate entity name.
- `asset_class` (Enum: `EQUITY`, `ETF`, `INDEX`, `COMMODITY`, `FX`, `CRYPTO`).
- `sector` (String): GICS Sector classification.
- `industry` (String): GICS Industry classification.
- `is_active` (Boolean): Active trading status.

#### `Instrument`
- `id` (UUID): Unique tradable instrument identifier.
- `asset_id` (UUID -> `Asset.id`): Associated underlying asset.
- `exchange_id` (UUID -> `Exchange.id`): Primary listed exchange.
- `instrument_type` (Enum: `SPOT`, `FUTURE`, `OPTION`, `PERPETUAL`).
- `tick_size` (Decimal): Minimum price increment.
- `lot_size` (Decimal): Minimum order quantity increment.

#### `OHLCV` (TimescaleDB Hypertable)
- `instrument_id` (UUID -> `Instrument.id`): Instrument identifier.
- `timestamp` (Timestamp UTC): Bar bucket start time.
- `timeframe` (Enum: `1s`, `1m`, `5m`, `15m`, `1h`, `1d`, `1w`).
- `open` (Decimal): Opening trade price.
- `high` (Decimal): Highest trade price.
- `low` (Decimal): Lowest trade price.
- `close` (Decimal): Closing trade price.
- `volume` (Decimal): Total traded volume.
- `vwap` (Decimal): Volume-weighted average price.
- `trades_count` (Integer): Number of discrete trade ticks.
- `provenance` (JSONB): Source, ingestion timestamp, and data version hash.

#### `CorporateAction`
- `id` (UUID): Unique corporate action identifier.
- `asset_id` (UUID -> `Asset.id`): Associated asset.
- `action_type` (Enum: `SPLIT`, `DIVIDEND_CASH`, `BONUS_SHARE`, `SPINOFF`, `MERGER`).
- `ex_date` (Date): Ex-action date.
- `record_date` (Date): Shareholder record date.
- `ratio` (Decimal): Split or bonus ratio (e.g., `4.0` for a 4-for-1 split).
- `amount` (Decimal): Cash dividend per share (ISO currency aligned).

---

### 2.2 Fundamental & Quantitative Entities

#### `FundamentalSnapshot`
- `id` (UUID): Unique fundamental record identifier.
- `asset_id` (UUID -> `Asset.id`): Associated asset.
- `filing_date` (Date): Date published/filed with regulator.
- `period_end_date` (Date): Financial quarter/fiscal year end date.
- `fiscal_year` (Integer): Fiscal year.
- `fiscal_period` (Enum: `Q1`, `Q2`, `Q3`, `Q4`, `FY`).
- `revenue` (Decimal): Total top-line revenue.
- `operating_income` (Decimal): EBIT.
- `net_income` (Decimal): Net profit after tax.
- `total_assets` (Decimal): Balance sheet total assets.
- `total_debt` (Decimal): Short-term + long-term debt.
- `total_equity` (Decimal): Total shareholder equity.
- `operating_cash_flow` (Decimal): Cash flow from operations.
- `capex` (Decimal): Capital expenditures.
- `diluted_shares` (Decimal): Diluted shares outstanding.

#### `TechnicalFeature`
- `id` (UUID): Unique feature record identifier.
- `instrument_id` (UUID -> `Instrument.id`): Associated instrument.
- `timestamp` (Timestamp UTC): Feature calculation timestamp.
- `feature_name` (String): Standard feature key (e.g., `SMA_200`, `RSI_14`, `ATR_14`).
- `value` (Decimal): Computed numerical feature value.
- `parameters` (JSONB): Input parameters used in calculation.

#### `QuantSignal`
- `id` (UUID): Unique signal identifier.
- `instrument_id` (UUID -> `Instrument.id`): Associated instrument.
- `strategy_id` (UUID -> `Strategy.id` | Null): Generating strategy model.
- `timestamp` (Timestamp UTC): Generation timestamp.
- `signal_type` (Enum: `ALPHA`, `RISK_FILTER`, `REGIME_SHIFT`, `VALUATION_GAP`).
- `direction` (Enum: `LONG`, `SHORT`, `NEUTRAL`, `FLAT`).
- `strength` (Decimal): Normalized signal strength $[-1.0, +1.0]$.
- `confidence` (Decimal): Probabilistic confidence $[0.0, 1.0]$.
- `rationale` (JSONB): Decomposed score components and explainability trace.

---

### 2.3 Portfolio, Order & Execution Entities

#### `User`
- `id` (UUID): Unique user identifier.
- `email` (String): User email address.
- `username` (String): Display username.
- `role` (Enum: `USER`, `RESEARCHER`, `ADMIN`).
- `created_at` (Timestamp UTC).

#### `Portfolio`
- `id` (UUID): Unique portfolio identifier.
- `user_id` (UUID -> `User.id`): Portfolio owner.
- `name` (String): Portfolio display name.
- `portfolio_type` (Enum: `LIVE_PAPER`, `BACKTEST_SIMULATED`, `BENCHMARK`, `SANDBOX`).
- `base_currency` (String): Base currency (ISO 4217).
- `cash_balance` (Decimal): Current available unallocated cash.
- `created_at` (Timestamp UTC).

#### `Holding` / `Position`
- `id` (UUID): Unique holding identifier.
- `portfolio_id` (UUID -> `Portfolio.id`): Parent portfolio.
- `instrument_id` (UUID -> `Instrument.id`): Held instrument.
- `quantity` (Decimal): Net units held (positive for long, negative for short).
- `average_cost` (Decimal): Volume-weighted average entry price.
- `unrealized_pnl` (Decimal): Mark-to-market unrealized profit/loss.
- `realized_pnl` (Decimal): Cumulative realized profit/loss.
- `updated_at` (Timestamp UTC).

#### `Order`
- `id` (UUID): Unique order identifier.
- `portfolio_id` (UUID -> `Portfolio.id`): Associated portfolio.
- `instrument_id` (UUID -> `Instrument.id`): Target instrument.
- `order_type` (Enum: `MARKET`, `LIMIT`, `STOP_LOSS`, `STOP_LIMIT`, `IOC`, `FOK`).
- `side` (Enum: `BUY`, `SELL`).
- `quantity` (Decimal): Requested order quantity.
- `limit_price` (Decimal | Null): Limit price threshold.
- `stop_price` (Decimal | Null): Trigger stop price threshold.
- `status` (Enum: `PENDING`, `SUBMITTED`, `PARTIALLY_FILLED`, `FILLED`, `CANCELLED`, `REJECTED`).
- `filled_quantity` (Decimal): Cumulative executed quantity.
- `average_fill_price` (Decimal): Volume-weighted average fill price.
- `created_at` (Timestamp UTC).

#### `Trade`
- `id` (UUID): Unique executed trade fill identifier.
- `order_id` (UUID -> `Order.id`): Parent order.
- `instrument_id` (UUID -> `Instrument.id`): Executed instrument.
- `price` (Decimal): Execution fill price.
- `quantity` (Decimal): Executed fill quantity.
- `fee` (Decimal): Total exchange, clearing, and brokerage fees.
- `slippage` (Decimal): Difference between expected arrival price and fill price.
- `executed_at` (Timestamp UTC).

---

### 2.4 Simulation, Backtest & Research Entities

#### `Strategy`
- `id` (UUID): Unique strategy identifier.
- `user_id` (UUID -> `User.id`): Author.
- `name` (String): Strategy name.
- `version` (String): Semantic version (e.g., `1.2.0`).
- `code_hash` (String): SHA-256 hash of immutable strategy code.
- `parameters_schema` (JSONB): Declared parameter ranges and types.

#### `Backtest` & `BacktestRun`
- `id` (UUID): Unique backtest run identifier.
- `strategy_id` (UUID -> `Strategy.id`): Tested strategy.
- `dataset_version_id` (UUID -> `DatasetVersion.id`): Input data snapshot.
- `start_date` (Timestamp UTC): Backtest start.
- `end_date` (Timestamp UTC): Backtest end.
- `initial_capital` (Decimal): Initial cash allocation.
- `slippage_model` (String): Slippage model specification.
- `fee_model` (String): Fee schedule specification.
- `random_seed` (Integer): Deterministic simulation seed.
- `metrics` (JSONB): Institutional summary (CAGR, Sharpe, Sortino, MDD, WinRate).
- `equity_curve` (JSONB): Timestamped portfolio equity array.

#### `Simulation` & `Agent`
- `id` (UUID): Unique market simulation session identifier.
- `name` (String): Simulation configuration name.
- `status` (Enum: `CREATED`, `RUNNING`, `PAUSED`, `COMPLETED`, `FAILED`).
- `tick_interval_ms` (Integer): Discrete simulation clock interval.
- `information_asymmetry_config` (JSONB): Tier configurations and noise variances.
- **`Agent` Entity:**
  - `id` (UUID): Agent instance identifier.
  - `simulation_id` (UUID -> `Simulation.id`): Parent simulation.
  - `agent_type` (Enum: `NOISE`, `VALUE`, `MOMENTUM`, `MARKET_MAKER`, `INFORMED`, `RL`).
  - `information_tier` (Enum: `TIER_A_100`, `TIER_B_60`, `TIER_C_10`).
  - `initial_cash` (Decimal): Agent starting capital.
  - `inventory` (Decimal): Agent starting asset units.

#### `Experiment` & `DatasetVersion`
- `id` (UUID): Unique research experiment identifier.
- `hypothesis` (String): Formal scientific hypothesis statement.
- `dataset_version_id` (UUID -> `DatasetVersion.id`): Pinned data snapshot.
- `model_version` (String): Model or algorithm version string.
- `parameters` (JSONB): Pinned hyperparameter configurations.
- `results` (JSONB): Statistical test outcomes and p-values.
- **`DatasetVersion` Entity:**
  - `id` (UUID): Immutable dataset version identifier.
  - `version_tag` (String): E.g., `US_EQUITIES_2015_2025_POINT_IN_TIME_v2`.
  - `universe` (JSONB): Asset symbol array.
  - `snapshot_timestamp` (Timestamp UTC).
  - `checksum_sha256` (String): Cryptographic integrity hash.
