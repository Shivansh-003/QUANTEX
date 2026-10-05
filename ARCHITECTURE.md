# QUANTEX — System Architecture Specification

**Document Version:** 1.0.0  
**Status:** Canonical Specification  
**Classification:** Technical System Architecture  

---

## 1. System Overview & Conceptual Topology

QUANTEX is architected as an event-driven, modular distributed platform designed for high throughput, sub-millisecond calculation loops in simulation, and reliable data provenance across empirical and synthetic domains.

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

---

## 2. Core Architectural Components

### 2.1 Layered Architecture Model

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER (Frontend Terminal)                   │
│  Next.js / React 19 / TypeScript / TailwindCSS / TradingView Lightweight      │
│  Charts / TanStack Query & Table / WebSockets / Web Workers                   │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │ (HTTPS / WSS / gRPC-Web)
┌──────────────────────────────────────▼────────────────────────────────────────┐
│                        API GATEWAY & ORCHESTRATION                            │
│  FastAPI / Reverse Proxy / JWT Authentication / Rate Limiting / Routing       │
└──────────────┬───────────────────────┬────────────────────────┬───────────────┘
               │                       │                        │
┌──────────────▼──────────┐ ┌──────────▼───────────┐ ┌──────────▼───────────────┐
│  MARKET DATA SERVICE    │ │  QUANTITATIVE ENGINE │ │  SIMULATION ENGINE       │
│  - Multi-feed Ingestion │ │  - Valuation Engine  │ │  - Matching Engine (LOB) │
│  - Historical DB Sync   │ │  - Signal Generator  │ │  - Multi-Agent Orchestr. │
│  - Normalization & Adj. │ │  - Risk Engine       │ │  - Asymmetric Info Hub   │
│  - Timeseries Cache     │ │  - Factor Analytics  │ │  - Microstructure Stream │
└──────────────┬──────────┘ └──────────┬───────────┘ └──────────┬───────────────┘
               │                       │                        │
┌──────────────▼───────────────────────▼────────────────────────▼───────────────┐
│               ANALYTICS, STRATEGY & BACKTESTING ENGINE                        │
│  - Event-Driven Backtester     - Portfolio Intelligence Ledger                │
│  - Paper-Trading Broker Sim    - Scenario & Stress-Testing Suite              │
│  - ML/RL Research Sandbox      - Trade Autopsy Engine                         │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼────────────────────────────────────────┐
│                      PERSISTENCE & EVENT BUS LAYER                            │
│  - TimescaleDB / PostgreSQL (Historical Bars, Fundamentals, Ledger, Accounts) │
│  - ClickHouse / Parquet (Ticks, L2/L3 Order Book Replay, High-Volume Data)    │
│  - Redis Cluster (In-Memory Pub/Sub, Live Order Books, Hot Indicator Cache)  │
│  - Apache Kafka / Redpanda (Market Event Bus, Asynchronous Task Queue)        │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Subsystem Technical Specifications

### 3.1 Frontend Architecture
- **Framework:** Next.js (App Router, Server Components where applicable, Client Components for interactive terminal states) with TypeScript.
- **State Management:** TanStack Query (React Query) for server state caching and deduplication; Zustand for local terminal state (active workspace, chart synchronization, crosshairs, tool selections).
- **Visualization:**
  - Candlestick & Tick Charting: TradingView Lightweight Charts with custom WebGL/Canvas overlays.
  - Microstructure & Complex Analytics: D3.js, Plotly, and HTML5 Canvas for real-time order book heatmaps and depth visualizers.
- **Streaming & Client Concurrency:** Dedicated WebSockets managed via a unified Connection Pool with automatic exponential backoff and message deduplication. Intensive client-side mathematical operations execute in background Web Workers.

### 3.2 Backend & Microservices Architecture
- **API Runtime:** Python 3.11+ / FastAPI for core REST and WebSocket services, providing asynchronous I/O and strict type validation.
- **Compute Kernels:** High-performance computation utilizing NumPy, Numba (JIT compilation for inner simulation loops), SciPy, Polars, and Pandas for vectorized numerical calculations.
- **Service Segregation:**
  - `quantex-gateway`: Authentication, routing, API token management, rate-limiting.
  - `quantex-marketdata`: Real-time ingestion, historical OHLCV data management, corporate action adjustments (splits, dividends).
  - `quantex-quant`: Fundamental analysis, DCF valuation, technical feature computation, risk modeling.
  - `quantex-backtest`: Vectorized and event-driven backtesting execution engine.
  - `quantex-paper`: Virtual order broker, position ledger, execution fill simulator.
  - `quantex-simulation`: Limit order book matching engine, heterogeneous agent runner, asymmetric information generator.
  - `quantex-ml`: Regime detection, factor research, reinforcement learning environments.

### 3.3 Quantitative Engine
- **Valuation Module:** Implements DCF with multi-stage growth, Monte Carlo sensitivity iterations, peer multiple benchmarking, and historical band valuations. Outputs continuous probability distributions rather than static point estimates.
- **Technical & Signal Module:** Vectorized calculation of momentum, mean-reversion, trend, volatility, and volume features. Supports custom composite quant signals with complete provenance.
- **Risk Module:** Calculates parametric, historical, and Monte Carlo VaR / Expected Shortfall (CVaR), multi-factor risk decomposition (Fama-French, Barra-style risk factors), maximum drawdown duration, and liquidity-adjusted liquidation cost.

### 3.4 Simulation & Microstructure Engine
- **Matching Engine (LOB):** In-memory Limit Order Book matching engine supporting price-time priority (FIFO) and pro-rata matching, Level 1 (Top of Book), Level 2 (Market Depth), and Level 3 (Full Order Queues) feeds.
- **Agent Orchestrator:** Discrete event simulation framework coordinating concurrent heterogeneous agents (Noise, Value, Momentum, Market Maker, Informed, RL).
- **Information Asymmetry Engine:** Generates ground-truth fundamental value paths and selectively distributes noisy, delayed, or partial observation signals to different agent tiers to model adverse selection and price discovery.

### 3.5 Storage, Caching, and Data Pipelines
- **Relational & Timeseries Store:** PostgreSQL with TimescaleDB extension for time-series bars, corporate fundamentals, portfolio transactions, backtest results, and audit logs.
- **High-Throughput Analytics Store:** ClickHouse / Apache Parquet on object storage for Level 2 tick data, agent simulation event traces, and factor datasets.
- **In-Memory Cache & Pub/Sub:** Redis 7.x cluster for real-time Level 1 quotes, order book state snapshots, agent state sync, and user session management.
- **Message Broker:** Apache Kafka / Redpanda for market tick streaming and decoupling analytical pipeline ingestion.

---

## 4. Communication & Protocol Specifications

### 4.1 Synchronous REST APIs
- Standard JSON over HTTPS using strict OpenAPI 3.1 specifications.
- Consistent envelope schema: `{ success: boolean, data: T, meta: { timestamp, version, provenance }, error: null | ErrorObject }`.
- Deterministic pagination (cursor-based for high-volume feeds, offset-based for screener tables).

### 4.2 Real-Time WebSocket Streaming
- Protobuf / JSON over WSS for multiplexed market streaming.
- Channels:
  - `market:ticker:{symbol}` — Real-time price, volume, change.
  - `market:depth:{symbol}` — L2/L3 order book updates (snapshot + delta encoding).
  - `paper:orders:{portfolioId}` — Live paper trading order status and fill events.
  - `sim:events:{simulationId}` — Live agent actions, book dynamics, and information events.

---

## 5. Security, Observability, and Operational Boundaries

### 5.1 Security Architecture
- **Zero Trust Network:** Microservices communicate over mutual TLS (mTLS) within an isolated VPC.
- **Authentication & Authorization:** OAuth2 with JWT tokens, role-based access control (RBAC), and scoped API key delegation.
- **Isolation of Virtual & Real Contexts:** Simulated executions and paper trading ledgers are segregated from external data ingestion credentials.
- **Data Protection:** Encryption at rest (AES-256) and in transit (TLS 1.3).

### 5.2 Observability & Telemetry
- **Distributed Tracing:** OpenTelemetry instrumentation across all services.
- **Metrics Collection:** Prometheus scraping calculation latencies, order matching throughput, cache hit rates, and WebSocket connection health.
- **Visualization:** Grafana dashboards for cluster health, engine bottlenecks, and service SLAs.
- **Structured Logging:** JSON logs shipped to centralized log storage with trace ID correlation.

### 5.3 Deployment Architecture
- **Containerization:** Docker container images built with multi-stage minimization.
- **Orchestration:** Kubernetes (K8s) manifests with Horizontal Pod Autoscaling (HPA) targeting CPU and custom queue depth metrics.
- **Infrastructure as Code:** Declarative Terraform/OpenTofu configurations for deterministic environment provisioning.
