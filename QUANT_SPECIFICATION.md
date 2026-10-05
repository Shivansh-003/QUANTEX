# QUANTEX — Quantitative & Mathematical Specification

**Document Version:** 1.0.0  
**Status:** Canonical Specification  
**Classification:** Quantitative Finance, Statistics & Valuation Contract  

---

## 1. Market Metrics & Statistical Foundations

All returns and price series in QUANTEX adhere to standard statistical and financial definitions.

### 1.1 Return Formulations
- **Simple Return ($R_t$):**
  $$R_t = \frac{P_t - P_{t-1} + D_t}{P_{t-1}}$$
  Where $P_t$ is the adjusted closing price at time $t$, and $D_t$ is the dividend paid at time $t$.

- **Logarithmic Return ($r_t$):**
  $$r_t = \ln\left(\frac{P_t + D_t}{P_{t-1}}\right) = \ln(1 + R_t)$$
  *Usage:* Applied in statistical modeling, time-additive multi-period aggregations, and continuous simulation.

- **Cumulative Return ($R_{0, T}$):**
  $$R_{0, T} = \prod_{t=1}^{T} (1 + R_t) - 1 = \exp\left(\sum_{t=1}^T r_t\right) - 1$$

- **Compounded Annual Growth Rate (CAGR):**
  $$\text{CAGR} = \left(\frac{P_T}{P_0}\right)^{\frac{1}{\text{Years}}} - 1$$

### 1.2 Volatility & Dispersion
- **Sample Volatility ($\sigma$):**
  $$\sigma = \sqrt{\frac{1}{N-1}\sum_{t=1}^N (r_t - \bar{r})^2}$$

- **Annualized Volatility ($\sigma_{\text{ann}}$):**
  $$\sigma_{\text{ann}} = \sigma \times \sqrt{K}$$
  Where $K = 252$ for daily equities, $K = 52$ for weekly, $K = 12$ for monthly, and $K = 252 \times 375$ for 1-minute intraday bars (standard equity session).

- **Rolling Volatility:**
  $$\sigma_{\text{roll}, t}(w) = \sqrt{\frac{1}{w-1}\sum_{i=0}^{w-1} (r_{t-i} - \bar{r}_{t, w})^2} \times \sqrt{K}$$
  Where $w$ is the rolling window length.

- **Parkinson Volatility (High-Low Range):**
  $$\sigma_P = \sqrt{\frac{1}{4 \ln 2 \cdot N} \sum_{t=1}^N \left(\ln\frac{H_t}{L_t}\right)^2} \times \sqrt{K}$$

- **Garman-Klass Volatility (OHLC Range):**
  $$\sigma_{GK} = \sqrt{\frac{1}{N}\sum_{t=1}^N \left[ 0.5 \left(\ln\frac{H_t}{L_t}\right)^2 - (2\ln 2 - 1)\left(\ln\frac{C_t}{O_t}\right)^2 \right]} \times \sqrt{K}$$

### 1.3 Covariance, Correlation & Beta
- **Covariance ($\text{Cov}(X, Y)$):**
  $$\text{Cov}(X, Y) = \frac{1}{N-1}\sum_{t=1}^N (R_{X, t} - \bar{R}_X)(R_{Y, t} - \bar{R}_Y)$$

- **Pearson Correlation Coefficient ($\rho_{X, Y}$):**
  $$\rho_{X, Y} = \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y} \quad \in [-1, +1]$$

- **Asset Beta ($\beta_i$ relative to benchmark $M$):**
  $$\beta_i = \frac{\text{Cov}(R_i, R_M)}{\sigma_M^2} = \rho_{i, M} \frac{\sigma_i}{\sigma_M}$$

---

## 2. Technical Indicators & Statistical Feature Engineering

### 2.1 Moving Averages
- **Simple Moving Average (SMA):**
  $$\text{SMA}_t(n) = \frac{1}{n}\sum_{i=0}^{n-1} P_{t-i}$$

- **Exponential Moving Average (EMA):**
  $$\text{EMA}_t(n) = \alpha P_t + (1 - \alpha) \text{EMA}_{t-1}(n), \quad \alpha = \frac{2}{n + 1}$$

### 2.2 Momentum & Oscillators
- **Relative Strength Index (RSI - Wilder's Formulation):**
  $$U_t = \max(P_t - P_{t-1}, 0), \quad D_t = \max(P_{t-1} - P_t, 0)$$
  $$\text{RS}_t(n) = \frac{\text{EMA}_t(U, n)}{\text{EMA}_t(D, n)}, \quad \text{RSI}_t(n) = 100 - \frac{100}{1 + \text{RS}_t(n)}$$

- **Moving Average Convergence Divergence (MACD):**
  $$\text{MACD Line} = \text{EMA}_t(12) - \text{EMA}_t(26)$$
  $$\text{Signal Line} = \text{EMA}_t(\text{MACD Line}, 9)$$
  $$\text{Histogram} = \text{MACD Line} - \text{Signal Line}$$

- **Rate of Change / Momentum (MOM):**
  $$\text{MOM}_t(n) = \frac{P_t - P_{t-n}}{P_{t-n}} \times 100$$

### 2.3 Volatility & Bands
- **True Range (TR) & Average True Range (ATR):**
  $$\text{TR}_t = \max\left( H_t - L_t, \, |H_t - C_{t-1}|, \, |L_t - C_{t-1}| \right)$$
  $$\text{ATR}_t(n) = \text{EMA}_t(\text{TR}, n)$$

- **Bollinger Bands:**
  $$\text{Middle Band}_t(n) = \text{SMA}_t(n)$$
  $$\text{Upper Band}_t(n, k) = \text{SMA}_t(n) + k \cdot \sigma_t(n)$$
  $$\text{Lower Band}_t(n, k) = \text{SMA}_t(n) - k \cdot \sigma_t(n) \quad (k = 2.0 \text{ default})$$
  $$\%B_t = \frac{P_t - \text{Lower Band}_t}{\text{Upper Band}_t - \text{Lower Band}_t}, \quad \text{Bandwidth}_t = \frac{\text{Upper Band}_t - \text{Lower Band}_t}{\text{Middle Band}_t}$$

### 2.4 Trend & Statistical Indicators
- **Average Directional Index (ADX):**
  Directional Movement (+DM, -DM), smoothed by Wilder's technique, normalized by ATR, generating Directional Indicators (+DI, -DI), and DX smoothed to produce ADX.
- **Statistical Z-Score:**
  $$Z_t(n) = \frac{P_t - \text{SMA}_t(n)}{\sigma_t(n)}$$

---

## 3. Fundamental Metrics & Financial Ratio Analysis

### 3.1 Capital Efficiency & Profitability
- **Return on Equity (ROE):**
  $$\text{ROE} = \frac{\text{Net Income}}{\text{Shareholders' Equity}}$$

- **Return on Capital Employed (ROCE):**
  $$\text{ROCE} = \frac{\text{EBIT}}{\text{Total Assets} - \text{Current Liabilities}}$$

- **Return on Invested Capital (ROIC):**
  $$\text{ROIC} = \frac{\text{NOPAT}}{\text{Invested Capital}} = \frac{\text{EBIT} \times (1 - \text{Effective Tax Rate})}{\text{Total Debt} + \text{Equity} - \text{Cash}}$$

- **Profit Margins:**
  $$\text{Gross Margin} = \frac{\text{Gross Profit}}{\text{Revenue}}, \quad \text{Operating Margin} = \frac{\text{Operating Income (EBIT)}}{\text{Revenue}}, \quad \text{Net Margin} = \frac{\text{Net Income}}{\text{Revenue}}$$

### 3.2 Solvency, Liquidity & Leverage
- **Debt-to-Equity (D/E):**
  $$\text{D/E} = \frac{\text{Total Debt}}{\text{Total Shareholders' Equity}}$$

- **Interest Coverage Ratio:**
  $$\text{Interest Coverage} = \frac{\text{EBIT}}{\text{Interest Expense}}$$

- **Current Ratio & Quick Ratio:**
  $$\text{Current Ratio} = \frac{\text{Current Assets}}{\text{Current Liabilities}}, \quad \text{Quick Ratio} = \frac{\text{Cash} + \text{Marketable Securities} + \text{Receivables}}{\text{Current Liabilities}}$$

### 3.3 Growth & Cash Flow Dynamics
- **Free Cash Flow (FCF):**
  $$\text{FCF} = \text{Operating Cash Flow (CFO)} - \text{Capital Expenditures (CapEx)}$$

- **Revenue / EPS / FCF Compound Annual Growth (CAGR):**
  $$g = \left(\frac{X_T}{X_0}\right)^{\frac{1}{T}} - 1$$

---

## 4. Valuation Engine Specification

QUANTEX intrinsic valuation is delivered as an ensemble probability distribution and confidence interval.

### 4.1 Discounted Cash Flow (DCF) Model

```text
FCF_t = Revenue_t × Operating Margin_t × (1 - Tax Rate) - CapEx_t - ΔNWC_t

PV(FCF) = Σ_{t=1}^n [ FCF_t / (1 + WACC)^t ]

TV = [ FCF_n × (1 + g) ] / (WACC - g)

PV(TV) = TV / (1 + WACC)^n

Enterprise Value (EV) = PV(FCF) + PV(TV)

Equity Value = EV + Cash & Equivalents - Total Debt - Minority Interest

Intrinsic Value Per Share = Equity Value / Diluted Shares Outstanding
```

#### Weighted Average Cost of Capital (WACC):
$$\text{WACC} = \left(\frac{E}{V} \times K_e\right) + \left(\frac{D}{V} \times K_d \times (1 - T)\right)$$
Where:
- $E$ = Market Value of Equity, $D$ = Market Value of Debt, $V = E + D$
- $K_e$ = Cost of Equity derived via CAPM: $K_e = R_f + \beta \times \text{ERP}$ ($R_f$ = Risk-Free Rate, $\text{ERP}$ = Equity Risk Premium)
- $K_d$ = Pre-tax Cost of Debt ($\text{Interest Expense} / \text{Total Debt}$)
- $T$ = Marginal Corporate Tax Rate

#### Monte Carlo Sensitivity & Uncertainty Range:
In addition to point estimates, the engine evaluates:
- Growth rate $g_t \sim \text{TruncatedNormal}(\mu_g, \sigma_g)$
- Terminal growth rate $g \sim \text{Uniform}(0.02, 0.035)$ (bounded below long-term GDP growth)
- WACC $\sim \text{Pert}(\text{WACC}_{\min}, \text{WACC}_{\text{base}}, \text{WACC}_{\max})$
- 10,000 Monte Carlo iterations yielding:
  - **10th Percentile (Conservative / Margin of Safety)**
  - **50th Percentile (Median Fair Value)**
  - **90th Percentile (Optimistic Ceiling)**

### 4.2 Relative Valuation & Multiples
- **Multiples Evaluated:**
  - Price-to-Earnings ($P/E$) & Forward $P/E$
  - Price-to-Book ($P/B$)
  - Enterprise Value-to-EBITDA ($\text{EV}/\text{EBITDA}$)
  - Free Cash Flow Yield ($\text{FCF} / \text{Market Cap}$)
- **Peer Regression:** Cross-sectional regression of multiples against growth ($g$) and ROE across the sector/industry universe to derive peer-implied fair multiples.

### 4.3 Ensemble Fair-Value Synthesis
The ensemble fair value range synthesizes DCF, Peer Multiples, and Historical Multiple Bands using an inverse-variance weighting model:
$$\text{Fair Value Range} = \left[ \text{P10}_{\text{ensemble}}, \, \text{P50}_{\text{ensemble}}, \, \text{P90}_{\text{ensemble}} \right]$$

---

## 5. Institutional Risk Engine Specification

### 5.1 Value at Risk (VaR) & Expected Shortfall (CVaR)
For confidence level $\alpha \in \{0.95, 0.99\}$ over time horizon $\Delta t$:

- **Parametric (Normal) VaR:**
  $$\text{VaR}_{\alpha} = -\left( \mu \Delta t + Z_{\alpha} \sigma \sqrt{\Delta t} \right) \times \text{Portfolio Value}$$

- **Cornish-Fisher Expansion VaR (Fat Tails & Skew Adjusted):**
  $$\tilde{Z}_{\alpha} = Z_{\alpha} + \frac{1}{6}(Z_{\alpha}^2 - 1)S + \frac{1}{24}(Z_{\alpha}^3 - 3Z_{\alpha})K - \frac{1}{36}(2Z_{\alpha}^3 - 5Z_{\alpha})S^2$$
  Where $S$ is sample skewness and $K$ is sample excess kurtosis.

- **Historical Simulation VaR:**
  $$\text{VaR}_{\alpha}^{\text{hist}} = -\text{Quantile}_{\alpha}(\{R_t\}_{t=1}^N) \times \text{Portfolio Value}$$

- **Conditional VaR / Expected Shortfall ($\text{CVaR}_{\alpha}$):**
  $$\text{CVaR}_{\alpha} = -\mathbb{E}\left[ R \,|\, R \le -\text{VaR}_{\alpha} \right] \times \text{Portfolio Value}$$

### 5.2 Performance & Risk Ratios
- **Sharpe Ratio:**
  $$\text{Sharpe} = \frac{\mathbb{E}[R_p - R_f]}{\sigma_p} \times \sqrt{K}$$

- **Sortino Ratio (Downside Risk):**
  $$\sigma_{\text{down}} = \sqrt{\frac{1}{N}\sum_{t=1}^N \min(R_{p, t} - R_f, 0)^2} \times \sqrt{K}, \quad \text{Sortino} = \frac{\mathbb{E}[R_p - R_f]}{\sigma_{\text{down}}} \times \sqrt{K}$$

- **Maximum Drawdown (MDD) & Calmar Ratio:**
  $$\text{DD}_t = \frac{\max_{0 \le s \le t} W_s - W_t}{\max_{0 \le s \le t} W_s}, \quad \text{MDD} = \max_{0 \le t \le T} \text{DD}_t$$
  $$\text{Calmar Ratio} = \frac{\text{CAGR}}{\text{MDD}}$$

### 5.3 Concentration & Factor Exposure
- **Herfindahl-Hirschman Index (HHI):**
  $$\text{HHI} = \sum_{i=1}^M w_i^2 \quad \in [1/M, 1.0]$$
- **Factor Exposure Model (Fama-French 5-Factor):**
  $$R_{i, t} - R_{f, t} = \alpha_i + \beta_{i, M} (R_{M, t} - R_{f, t}) + \beta_{i, \text{SMB}} \text{SMB}_t + \beta_{i, \text{HML}} \text{HML}_t + \beta_{i, \text{RMW}} \text{RMW}_t + \beta_{i, \text{CMA}} \text{CMA}_t + \epsilon_{i, t}$$

---

## 6. Explainable Quantitative Scoring Architecture

Quantitative scores satisfy four strict criteria:
1. **Explainability:** Each score decomposes into explicit sub-components with visible mathematical weights.
2. **Input Traceability:** Every sub-component links directly to immutable underlying financial or market data fields.
3. **Reproducibility:** Two independent evaluations on identical dataset snapshots yield bit-identical score outputs.
4. **Versioned Lineage:** Score formulas are tagged with semantic version numbers (e.g., `ValueScore_v1.2.0`).

### Standard Score Decomposition Schema:
```text
Composite Score S = Σ (w_k × Normalizer(Factor_k))
Where Normalizer(x) = Winsorized Z-Score mapped to [0, 100] percentile rank.
```
Score API responses return the complete contribution vector:
```json
{
  "score_name": "ValuationQuality_v1.0",
  "total_score": 78.4,
  "confidence_interval": [74.2, 82.6],
  "components": [
    {"name": "EV_EBITDA_Percentile", "raw_value": 11.2, "score": 82.0, "weight": 0.35, "contribution": 28.7},
    {"name": "ROIC_ZScore", "raw_value": 0.22, "score": 88.0, "weight": 0.40, "contribution": 35.2},
    {"name": "FCF_Yield", "raw_value": 0.065, "score": 72.5, "weight": 0.25, "contribution": 18.1}
  ]
}
```
