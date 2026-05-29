# Fiskal Discovery — Smart Logic Map
> Read-only reference. Last updated: 2026-05-29.

---

## 1. Funding Finder

**Entry point:** `funding-finder.html` → `buildDiscoverySummary('funding-finder', answers)`

**Logic files loaded:**
- `logic/globalInsights.js`
- `logic/sectorInsights.js`
- `logic/fundingFinderInsights.js`
- `logic/productLinks.js`
- `logic/summaryBuilder.js`
- `logic/chartLibrary.js`
- `logic/fiskalLoading.js`

**Summary call chain (in order):**
1. `buildDiscoverySummary('funding-finder', answers)` → `buildFundingFinderSummary(answers)`
2. `isNewStart(answers)` → if true, `getNewStartInsight()`
3. `getSectorNote(business, industry)` — opening sector fragment
4. `getTopFundingFinderInsights(answers, business, industry)` — returns top 2 product insights
   - internally calls `normaliseFundingProduct(product)` for each matched product
   - selects from priority-ranked product insight functions:

| Priority | Function | Trigger |
|----------|----------|---------|
| 100 | `getInvoiceFinanceInsight()` | `invoice` matched |
| 90 | `getTradeFinanceInsight()` | `trade` matched |
| 85 | `getAssetFinanceInsight()` | `asset` matched |
| 80 | `getRevolvingCreditInsight()` | `revolving` matched |
| 75 | `getBusinessLoanInsight()` | `loan` matched |
| 70 | `getPropertyFinanceInsight()` | `property` matched |
| 65 | `getRDTaxCreditInsight()` | `rd` matched |
| 50 | `getMerchantCashAdvanceInsight()` | `mca` matched |
| 40 | `getFXInsight()` | `fx` matched |

5. `hasCreditConcern(answers)` → if true and blocks < 2, `getCreditConcernInsight()`
6. `"Nicole will be in touch personally..."` appended to finalBlocks
7. `blocksToHtml(finalBlocks)` — output capped at 2 content blocks + closing

**Chart call chain (separate, in `funding-finder.html`):**
- `getFundingChartHtml(matchedProducts, state)` → one or more animated SVG charts

| Condition | Chart(s) rendered |
|-----------|------------------|
| `acquisition: Yes` | `_fc_acquisitionChart()` |
| invoice + trade | `_fc_combinedCycle()` |
| invoice only | `_fc_invoiceOnly()` + `_fc_spotFundingChart()` |
| trade only | `_fc_tradeOnly()` |
| mca | `_fc_mcaChart()` |
| debtRecovery | `_fc_debtChart()` |
| none of above | `_fc_repaymentChart()` |
| 2+ products | `_fc_productFitChart()` always appended |

**Inputs consumed:**
`name`, `business`, `industry`, `barrier`, `urgency`, `fundingPurpose`, `matchedProducts`, `turnover`, `fundingAmount`, `invoice`, `paymentTerms`, `trade`, `asset`, `loan`, `property`, `revolving`, `mca`, `rd`, `fx`

**Dead / unwired logic:** none

---

## 2. Facility Review

**Entry point:** `facility-review.html` → custom inline `buildFacilityReviewSummary()` (local function ~line 4448)

> ⚠️ **Note:** `facilityReviewInsights.js`, `summaryBuilder.js`, and `sectorInsights.js` are **not loaded** in this page. The page uses its own richer inline logic instead of the central insight engine. `summaryBuilder.js`'s `buildFacilityReviewSummary()` exists but is not called here.

**Logic files loaded:**
- `logic/globalInsights.js`
- `logic/fiskalLoading.js`

**Summary call chain (inline, in order):**
1. Detect `state.selectedReviewType` / `state.facilityType`
2. Provider name resolved from type-specific field (`if-lender-val`, `loanLender`, `assetProvider`, etc.)
3. Opening paragraph: provider + subtype-aware string
4. Type-specific builder called:
   - `_buildIFSummary(state)` — Invoice Finance
   - `_buildLoanSummary(state)` — Business Loan
   - `_buildAssetSummary(state)` — Asset Finance
   - `_buildOverdraftSummary(state)` — Overdraft *(not in insight engine)*
   - `_buildMCASummary(state)` — Merchant Cash Advance *(not in insight engine)*
   - `_buildTradeSummary(state)` — Trade Finance
   - `_buildFXSummary(state)` — Foreign Currency
   - `_buildOtherSummary(state)` — Other Facility
5. Barrier check: if barrier text contains `contract / tied / stuck / notice / exit / fee` → switching note appended
6. Statement CTA if no file uploaded (invoice/loan/asset/trade only)
7. `"Nicole will be in touch personally..."` closing

**Key inputs by type:**
- IF: `turnover`, `paymentTerms`, `if-lender-val`, `if-knowledge`, `if-type`, `ifServiceFee`, `ifDiscount`, `ifBdp`, `ifMinimums`
- Loan: `loanRepayment`, `loanMonthlyCost`, `loanKnowledge`, `loanLender`
- Asset: `assetNearlyPaidOff`, `assetUpgrade`, `assetValueChange`, `industry`
- Trade: `tradeRate`, `tradePropertyCharge`, `tradeReaching`, `tradeGrowth`, `turnover`
- MCA: factor rate, B2C flag
- Overdraft: provider, knowledge level
- FX: `fxProvider`, `fxAnnualVolume`, `fxCurrencies`, `fxMargin`
- Other: `otherFundingType`, facility description

**Dead / unwired logic:**
- `facilityReviewInsights.js` → `getStuckInContractInsight()` — defined, never called anywhere
- `summaryBuilder.js` → `buildFacilityReviewSummary()` — exists but bypassed by inline logic

---

## 3. Loan Enquiry

**Entry point:** `loan-application.html` → `buildDiscoverySummary('loan-application', answers)`

**Logic files loaded:**
- `logic/globalInsights.js`
- `logic/loanApplicationInsights.js`
- `logic/summaryBuilder.js`
- `logic/fiskalLoading.js`

**Summary call chain (in order):**
1. `buildDiscoverySummary('loan-application', answers)` → `buildLoanApplicationSummary(answers)`
2. `isNewStart(answers)` → if true, `getNewStartInsight()`
3. `getLoanPurposeInsight(purpose, business)` — purpose-based para 1
4. `getCreditHistoryInsight(credit)` — credit profile note → appended to para 2
5. `getLoanCreditConcernInsight(barrier, barrierDetails, business)` → appended to para 2
6. `getLoanSecurityInsight(security, properties, business)` → appended to para 2
7. `"Nicole will be in touch personally..."` appended to finalBlocks
8. `blocksToHtml(finalBlocks)` — output capped at 2 content blocks + closing

**Inputs consumed:**
`name`, `business`, `purpose`, `amount`, `security`, `credit`, `turnover`, `existingFacilities`, `barrier`, `barrierDetails`, `properties`

**Dead / unwired logic:**
- `loanApplicationInsights.js` → `getExistingFacilitiesNote(existingFacilities, businessName)` — defined, never called
- `sectorInsights.js` — not loaded on this page

---

## 4. Shariah Compliant Funding

**Entry point:** `shariah-funding.html` → `submitDiscovery()` → `buildDiscoverySummary('shariah', shariahAnswers)`

**Logic files loaded:** (not audited — assumed same as funding-finder minus chartLibrary)

**Summary call chain (in order):**
1. `buildDiscoverySummary('shariah', answers)` → `buildShariahSummary(answers)`
2. `isNewStart(answers)` → if true, `getNewStartInsight()`
3. `getShariahOpeningInsight(business, purposes, otherPurpose)` — para 1
4. `getShariahStructureInsight(purposes, otherPurpose)` — para 2 (structure recommendation)
5. `getShariahPurposeInsight(purposes, otherPurpose, business)` — para 3 (if applicable)
6. `getShariahAmountInsight(amount, notSure)` — para 4 (if applicable)
7. `getShariahMarketInsight()` — market context
8. `getShariahPracticalInsight(amount, notSure)` — practical close
9. `"Nicole will be in touch personally..."` appended
10. `blocksToHtml(blocks)`

**Inputs consumed:**
`purposes`, `otherPurpose`, `complianceLevel`, `notSure`, `amount`, `timeline`, `business`, `propertyInterest`, `fx`, `debtRecovery`, `asset`, `loan`

**Dead / unwired logic:** not audited

---

## 5. Cashflow Invaders

**Entry point:** `cashflow-invaders.html` (standalone game — no external logic files)

**All logic is inline. Key functions:**

| Function | Role |
|----------|------|
| `initGame(startWave)` | Sets up game state, waves 1–20 |
| `spawnWave(n)` | Spawns n enemy aliens |
| `spawnBoss()` | Spawns wave-specific boss |
| `getBossNameForWave(w)` | Returns boss name (waves 1–20) |
| `skipWave()` | Advances wave without clearing |
| `gameOver()` | End-game sequence |
| `saveLB(name, company, score, wave, isLender)` | Saves score to leaderboard (async) |
| `renderLB()` | Renders leaderboard table |
| `getTarget(idx)` | Returns cash milestone target |

**Scoring rules:**
- Enemy kill: `10 + wave × 2` cash (×2 if extraIncome active)
- Word enemy kill: `120 + wave × 12` cash
- Boss defeat: `200 + wave × 50`
- Milestone bonus: alternates +1 life (odd) / 3× bombs (even)

**Difficulty scaling:**
- Spawn rate: `max(35, floor((120 − wave×5) / advancedMultiplier))`
- Wave target enemies: `6 + wave`
- Wave cash target: `120 + wave×60 + wave²×5`
- Advanced mode (wave 11+): multiplier = `1 + (wave−10) × 0.08`
- Boss HP: `5 + wave×3` (waves 1–9); `20 + wave×4` (Larry, wave 10); `floor((20 + wave×5) × advancedMultiplier)` (waves 11–19); `280` (Bobby, wave 20)

**Named bosses:** Larry (wave 10), Bobby (wave 20); waves 11–19 have Act 2 variant names

**Dead / unwired logic:**
- `getLocalLB()` — leaderboard retrieval helper, defined but never called from UI

---

## Cross-Module Dependency Tree

```
summaryBuilder.js
├── globalInsights.js      [isNewStart, getNewStartInsight, hasCreditConcern, getCreditConcernInsight]
├── sectorInsights.js      [getSectorNote]
├── fundingFinderInsights.js  [getTopFundingFinderInsights]
│   ├── globalInsights.js  [parseMoneyString]
│   └── sectorInsights.js  [detectSector, getSectorInvoiceFinanceInsight]
├── loanApplicationInsights.js  [getLoanPurposeInsight, getCreditHistoryInsight,
│                                getLoanCreditConcernInsight, getLoanSecurityInsight]
├── facilityReviewInsights.js   [getFacilityReviewOpening, getInvoiceFinanceReviewInsight,
│   │                            getLoanReviewInsight, getAssetFinanceReviewInsight,
│   │                            getTradeFinanceReviewInsight, getFXReviewInsight,
│   │                            getOtherFacilityReviewInsight, getUnknownRatesInsight]
│   └── sectorInsights.js  [detectSector]
└── shariahInsights.js     [getShariahOpeningInsight, getShariahStructureInsight,
                             getShariahPurposeInsight, getShariahAmountInsight,
                             getShariahMarketInsight, getShariahPracticalInsight]

chartLibrary.js (Funding Finder only)
└── globalInsights.js  [parseMoneyString]

facility-review.html (inline logic — does NOT use summaryBuilder)
└── globalInsights.js  [loaded but minimal direct use]
```

---

## Dead / Unwired Functions Summary

| File | Function | Status |
|------|----------|--------|
| `facilityReviewInsights.js` | `getStuckInContractInsight()` | Defined, never called |
| `loanApplicationInsights.js` | `getExistingFacilitiesNote()` | Defined, never called |
| `cashflow-invaders.html` | `getLocalLB()` | Defined, never called from UI |
| `summaryBuilder.js` | `buildFacilityReviewSummary()` | Exists but bypassed by facility-review.html inline logic |
