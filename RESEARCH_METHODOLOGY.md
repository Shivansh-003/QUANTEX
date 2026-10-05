# QUANTEX — Quantitative Research Methodology & Experimental Standards

**Document Version:** 1.0.0  
**Status:** Canonical Specification  
**Classification:** Scientific Research Contract, Validation & Anti-Bias Framework  

---

## 1. Research Philosophy

Quantitative finance is empirical science, not curve-fitting. QUANTEX enforces rigorous methodological discipline to ensure that strategies and analytical models represent genuine economic phenomena rather than statistical noise or historical artifacts.

> [!IMPORTANT]
> A smooth historical equity curve is **NEVER** sufficient evidence of strategy validity. A strategy is only deemed credible when it demonstrates statistical significance, out-of-sample stability, economic rationale, and robustness to friction.

---

## 2. Canonical Experiment Protocol Specification

Every quantitative research experiment, backtest, or factor study executed within QUANTEX is accompanied by an immutable metadata manifest specifying nineteen required fields:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                     QUANTEX EXPERIMENT MANIFEST SCHEMA                      │
├─────────────────────────┬───────────────────────────────────────────────────┤
│ 1. Hypothesis           │ Explicit economic or statistical hypothesis.      │
│ 2. Universe             │ Specific asset universe (e.g., S&P 500 constituents).│
│ 3. Dataset              │ Input market and fundamental data source.         │
│ 4. Dataset Version      │ Cryptographically pinned dataset version ID.      │
│ 5. Time Period          │ Exact start and end timestamps (UTC).             │
│ 6. Features             │ Specific engineered mathematical features.        │
│ 7. Strategy Definition  │ Semantic version and code hash of strategy rules. │
│ 8. Parameters           │ Complete dictionary of parameter values.          │
│ 9. Transaction Costs    │ Commission and fee schedule (in bps or per share).│
│ 10. Slippage Model      │ Mathematical slippage function (e.g., Almgren-Chriss).│
│ 11. Execution Model     │ Point-in-time fill logic (e.g., next bar open).   │
│ 12. Rebalance Freq.     │ Discrete execution frequency (e.g., Daily, Weekly).│
│ 13. Train/Test Split    │ Explicit temporal partitions (In-Sample / OOS).   │
│ 14. Validation Method   │ E.g., Walk-Forward, Combinatorial Purged CV.      │
│ 15. Random Seed         │ Integer seed for deterministic pseudo-randomness. │
│ 16. Code/Model Version  │ Git commit hash and environment lock checksum.    │
│ 17. Target Metrics      │ Declared evaluation criteria before testing.      │
│ 18. Empirical Results   │ Complete metric outputs, p-values, and drawdowns. │
│ 19. Known Limitations   │ Documented capacity bounds and regime risks.      │
└─────────────────────────┴───────────────────────────────────────────────────┘
```

---

## 3. Systematic Bias Prevention & Mitigation

QUANTEX implements architectural safeguards against core quantitative research biases:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                             BIAS MITIGATION ARCHITECTURE                                │
├──────────────────────────┬──────────────────────────────────────────────────────────────┤
│ Bias Category            │ QUANTEX Architectural Countermeasure & Enforcement           │
├──────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 1. Look-Ahead Bias       │ Strict Point-in-Time (PIT) data indexing. Financial filings │
│                          │ are stamped with public release dates, not period ends.     │
│                          │ Features at time $t$ can only reference data $\le t-1$.     │
├──────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 2. Survivorship Bias     │ Universe inclusion is reconstructed dynamically for every    │
│                          │ historical timestamp, incorporating delisted, merged, and    │
│                          │ bankrupt securities.                                         │
├──────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 3. Data Leakage          │ Feature scaling, normalization, and PCA transforms are       │
│                          │ calibrated strictly on In-Sample (IS) training folds and     │
│                          │ applied out-of-sample without refitting.                     │
├──────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 4. Overfitting &         │ Deflated Sharpe Ratio (DSR) and Minimum Backtest Length      │
│    Data Snooping         │ (MinBTL) calculations penalize trials for number of tests.   │
├──────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 5. Selection Bias        │ Negative and failed experiment runs are archived in the      │
│                          │ Experiment Registry to track total trial counts.             │
├──────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 6. Cost Neglect Bias     │ Zero-friction backtests are flagged in reporting.             │
│                          │ Slippage, borrow fees, and exchange fees are modeled.        │
└──────────────────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 4. Cross-Validation & Validation Methodologies

### 4.1 Walk-Forward Cross-Validation (WFCV)
Standard k-fold cross-validation is invalid in time series due to serial correlation and leakage. QUANTEX uses expanding and rolling Walk-Forward analysis:

```text
Fold 1: [--- Train In-Sample ---][ Validate ]
Fold 2: [------ Train In-Sample ------][ Validate ]
Fold 3: [--------- Train In-Sample ---------][ Validate ]
Fold 4: [------------ Train In-Sample ------------][ Out-of-Sample Holdout ]
Time ──►
```

### 4.2 Combinatorial Purged Cross-Validation (CPCV)
To maximize training efficiency while preventing information leakage, QUANTEX supports CPCV methodology:
- **Purging:** Removing training labels that overlap with the testing period.
- **Embargoing:** Removing training samples immediately following the test period to account for auto-regressive memory.

---

## 5. Statistical Significance & Hypothesis Testing

### 5.1 Deflated Sharpe Ratio (DSR)
When testing multiple strategy variations or parameter combinations, the probability of finding a high Sharpe ratio purely by chance approaches 1.0. QUANTEX computes the Deflated Sharpe Ratio:

$$\text{DSR} = \Phi\left( \frac{(\widehat{\text{SR}} - \text{SR}^*) \sqrt{N - 1}}{\sqrt{1 - \hat{\gamma}_3 \widehat{\text{SR}} + \frac{\hat{\gamma}_4 - 1}{4}\widehat{\text{SR}}^2}} \right)$$

Where:
- $\text{SR}^* = \sqrt{2 \ln K} \times \sigma_{\text{SR}}$ represents the expected maximum Sharpe ratio under the null hypothesis of zero true alpha across $K$ independent trials.
- $\hat{\gamma}_3$ and $\hat{\gamma}_4$ are the skewness and kurtosis of returns.
- $\Phi$ is the standard normal cumulative distribution function.

A strategy is rejected if $\text{DSR} < 0.95$ ($p > 0.05$).

### 5.2 Stationary Bootstrap & Monte Carlo Permutations
- **Stationary Bootstrap (Politis & Romano):** Block-resampling of returns with random geometric block lengths to construct 95% confidence intervals around Sharpe, Calmar, and Drawdown metrics without assuming Gaussian distributions.
- **Monte Carlo Permutation Tests:** Shuffling trade order 10,000 times to construct the empirical distribution of maximum drawdowns and ruin probabilities.

---

## 6. Sensitivity & Robustness Analysis

### 6.1 Parameter Stability Surfaces
A robust alpha strategy operates in a wide, stable plateau in parameter space rather than a fragile spike.

```
Sharpe
  ▲
  │        Robust Strategy                   Fragile Overfit Spike
  │       ┌───────────────┐                          /\
  │      /                 \                        /  \
  │  ───┘                   └───              ─────/    \──────
  └──────────────────────────────►          ──────────────────►
         Parameter Value                           Parameter Value
```

QUANTEX generates 2D and 3D parameter stability heatmaps across moving average windows, threshold levels, and holding periods. Strategies displaying sharp, discontinuous cliff edges are flagged as overfit.

### 6.2 Transaction-Cost Sensitivity Sweeps
Backtests include a cost-sensitivity sweep from $0\text{ bps}$ to $50\text{ bps}$ per round-trip trade:
- **Break-Even Friction:** The transaction fee level at which strategy Sharpe ratio decays to $0.0$. If break-even friction is below realistic market costs ($< 5\text{ bps}$ for liquid equities), the strategy is classified as non-viable.
