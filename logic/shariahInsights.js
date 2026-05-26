// shariahInsights.js
// Insight blocks for the Shariah-Compliant Funding results page.

// ============================================================
// FISKAL DISCOVERY — Shariah-Compliant Finance Statistics
// Sources: ONS Census, MCB 2025, Mordor Intelligence,
//          Chambers & Partners, Mud Orange/LBBOnline,
//          Qardus, Finspire, FCSA — 2025/26
// ============================================================
const fiskalShariahStats = {
  ukMuslimPopulation: {
    totalPopulation_2021Census: 3900000,
    estimate_2025_2026_low: 4100000,
    estimate_2025_2026_high: 4400000,
    pctOfUKPopulation: '6.0–6.4',
    averageAge: 27,
    pctAged50OrUnder: 84.5,
    selfEmploymentRate: 'above national average',
    regionsHighestConcentration: [
      { region: 'Greater London',      pct: 15.0 },
      { region: 'West Midlands',       pct: 9.6  },
      { region: 'Yorkshire & Humber',  pct: 8.1  },
      { region: 'North West England',  pct: 7.6  },
    ],
    note_opportunity: 'Young, entrepreneurial, growing population — large pipeline of new business owners entering market annually',
  },
  demandGap: {
    pctMuslimsExploringShariahFinance: 44,
    pctMuslimsWithoutShariahPension: 33,
    pctCitingShariahConcernForNoPension: 78,
    perception: 'critical gap between demand and supply',
    mainBarriers: [
      'Limited awareness of available products',
      'Distrust of legacy institutions',
      'Poor customer experience from early providers',
      'Misconception that Shariah finance = compromise product',
    ],
    note_nonMuslim: 'Shariah-compliant finance increasingly used by non-Muslim business owners for commercial reasons — transparency, fixed costs, no compounding interest',
    note_openTo: 'Any business in a halal sector (excludes gambling, alcohol, pork production) can access Shariah-compliant funding regardless of owner\'s faith',
  },
  ukMarket: {
    marketValue_GBP_bn: 6,
    marketValue_USD_bn_2025: 7.81,
    marketValue_USD_bn_2026: 8.06,
    marketValue_USD_bn_2031: 9.42,
    CAGR_2026_2031_pct: 3.19,
    fullyIslamicBanks_UK: 5,
    conventionalBanksOfferingIslamicProducts: 20,
    sukukRaisedOnLSE_bn_usd: 90,
    note: 'UK is the largest Islamic finance hub in Europe and the leading Western hub globally',
  },
  globalMarket: {
    globalMarketValue_2023_tn_usd: 2.5,
    globalMarketValue_2033_tn_usd: 7.7,
    globalCAGR_pct: 12,
    businessSegmentShare_pct: 57.32,
    businessUses: [
      'Shariah-compliant revolving credit',
      'Trade finance',
      'Sukuk issuance',
      'SME lending',
      'Asset/equipment finance',
    ],
  },
  keyStructures: {
    murabaha: {
      description: 'Asset purchase and resale at a pre-agreed profit margin — no interest charged',
      fiskalEquivalent: 'Trade finance / asset finance',
      commonUse: 'Stock/inventory purchase, equipment, vehicles',
    },
    ijara: {
      description: 'Leasing structure — lender buys the asset and leases it to the business',
      fiskalEquivalent: 'Asset finance / hire purchase equivalent',
      commonUse: 'Plant, machinery, vehicles',
    },
    musharaka: {
      description: 'Profit and loss sharing partnership — funder takes equity stake',
      fiskalEquivalent: 'Equity / partnership funding',
      commonUse: 'Business expansion, joint ventures',
    },
    diminishingMusharaka: {
      description: 'Business gradually buys out funder\'s share over time',
      fiskalEquivalent: 'Property finance / larger asset acquisition',
      commonUse: 'Commercial property, large capital assets',
    },
    qardHasan: {
      description: 'Interest-free loan — borrower repays principal only',
      fiskalEquivalent: 'Microfinance / community lending',
      commonUse: 'Micro-enterprises, early-stage businesses',
    },
  },
  SMEContext: {
    pctSMEsInUKBusinessPopulation: 99.2,
    shariahFinanceRangeTypical_low_GBP: 30000,
    shariahFinanceRangeTypical_high_GBP: 500000,
    fundingDecisionSpeed_hours: 48,
    profitRateStartingPoint_pctPerMonth: 1.25,
    eligibilityTypical: [
      'UK-registered Ltd or LLP',
      'Minimum 3 years trading',
      'Stable cashflow',
      'No outstanding CCJs',
      'Operates in Shariah-compliant sector',
    ],
    note_growth: 'Muslim entrepreneurship is rising — demand for Shariah-compliant SME funding is growing faster than supply from mainstream lenders',
  },
};

function getShariahOpeningInsight(businessName, purposes, otherPurpose) {
  const name = businessName || 'the business';
  const purposeText = otherPurpose || (Array.isArray(purposes) ? purposes.join(' and ') : purposes);

  let para = `Based on what you've told us, Shariah-compliant funding is worth exploring for ${name}. You're looking for support with`;
  if (purposeText && purposeText !== 'Something else') {
    para += ` ${purposeText.toLowerCase()}`;
  } else {
    para += ` a specific requirement`;
  }
  para += `, which means this needs to be approached differently from a standard business loan or conventional finance application.`;

  return para;
}

function getShariahAmountInsight(amount, notSure) {
  if (notSure || !amount || amount === 'Not sure yet') {
    return `As you're not yet sure how much funding may be needed, the sensible first step is to work backwards from the purpose and identify a realistic funding range.`;
  }

  const parsed = parseMoneyString(amount);
  if (parsed) {
    const formatted = '\u00a3' + parsed.toLocaleString('en-GB');
    return `You've indicated that around ${formatted} may be needed, so this can be reviewed against the purpose, structure and provider criteria.`;
  }

  return null;
}

function getShariahPurposeInsight(purposes, otherPurpose, businessName) {
  const name = businessName || 'the business';
  const purposeList = Array.isArray(purposes) ? purposes : [purposes];
  
  // If other purpose is provided, use that
  if (otherPurpose) {
    return null; // No specific insight for custom purposes
  }

  // Build purpose-specific sentences for each selected purpose
  let insights = [];
  
  for (const purpose of purposeList) {
    const p = (purpose || '').toLowerCase();
    
    if (p.includes('equipment') || p.includes('machinery') || p.includes('vehicle')
        || p.includes('asset') || p.includes('plant')) {
      insights.push(`Asset-based structures may be worth exploring.`);
    }
    else if (p.includes('growth') || p.includes('expand') || p.includes('expansion')
        || p.includes('hire') || p.includes('invest')) {
      insights.push(`The funding should support the next stage of ${name}.`);
    }
    else if (p.includes('working capital') || p.includes('cashflow') || p.includes('cash flow')
        || p.includes('wages') || p.includes('day to day')) {
      insights.push(`The focus should be on finding a structure that gives ${name} breathing room.`);
    }
    else if (p.includes('stock') || p.includes('inventory') || p.includes('trade')
        || p.includes('supplier') || p.includes('goods') || p.includes('purchase')) {
      insights.push(`Supplier, stock or trade-related structures may be available on a Shariah-compliant basis.`);
    }
    else if (p.includes('property') || p.includes('premises') || p.includes('building')
        || p.includes('office') || p.includes('warehouse') || p.includes('commercial')) {
      insights.push(`This may need a more specialist property-backed review.`);
    }
    else if (p.includes('refinanc') || p.includes('consolidat') || p.includes('existing')) {
      insights.push(`Reviewing existing funding and whether a more suitable structure could improve the position may be valuable.`);
    }
  }
  
  // Return combined insights as one sentence, or null if none
  if (insights.length === 0) return null;
  if (insights.length === 1) return insights[0];

  return insights.slice(0, 2).join(' ');
}

// Returns the most relevant Shariah structure name + plain-English description
// based on what the business is trying to fund.
function getShariahStructureInsight(purposes, otherPurpose) {
  const purposeList = Array.isArray(purposes) ? purposes : [purposes];
  const combined = (purposeList.join(' ') + ' ' + (otherPurpose || '')).toLowerCase();

  if (combined.match(/equipment|machinery|vehicle|asset|plant/)) {
    const s = fiskalShariahStats.keyStructures.ijara;
    return `For asset or equipment funding, an Ijara (leasing) structure is typically the most suitable route — ${s.description.toLowerCase()}.`;
  }
  if (combined.match(/stock|inventory|supplier|trade|goods|purchase/)) {
    const s = fiskalShariahStats.keyStructures.murabaha;
    return `For stock or supplier payments, a Murabaha structure is the standard approach — ${s.description.toLowerCase()}.`;
  }
  if (combined.match(/property|premises|building|office|warehouse|commercial/)) {
    const s = fiskalShariahStats.keyStructures.diminishingMusharaka;
    return `For property acquisition, Diminishing Musharaka is the most common structure — ${s.description.toLowerCase()}.`;
  }
  if (combined.match(/growth|expand|expansion|invest|partner|joint/)) {
    const s = fiskalShariahStats.keyStructures.musharaka;
    return `For growth or expansion capital, a Musharaka (partnership) arrangement may be available — ${s.description.toLowerCase()}.`;
  }
  return null;
}

// Returns a market context sentence — reassures the business that Shariah finance
// is established, growing and not a compromise product.
function getShariahMarketInsight() {
  const m = fiskalShariahStats.ukMarket;
  const d = fiskalShariahStats.demandGap;
  return `The UK is the largest Islamic finance hub in Europe, with a sector worth over £${m.marketValue_GBP_bn}bn and ${m.fullyIslamicBanks_UK} fully Shariah-compliant banks alongside ${m.conventionalBanksOfferingIslamicProducts} conventional lenders offering Islamic products. ${d.note_nonMuslim}.`;
}

// Returns a practical eligibility + timeline sentence using SME stats.
function getShariahPracticalInsight(amount, notSure) {
  const s = fiskalShariahStats.SMEContext;
  const low  = '£' + s.shariahFinanceRangeTypical_low_GBP.toLocaleString('en-GB');
  const high = '£' + s.shariahFinanceRangeTypical_high_GBP.toLocaleString('en-GB');
  let sentence = `Typical Shariah-compliant SME funding ranges from ${low} to ${high}, with decisions in as little as ${s.fundingDecisionSpeed_hours} hours.`;
  if (!notSure && amount) {
    sentence += ` The profit rate (not interest) typically starts from ${s.profitRateStartingPoint_pctPerMonth}% per month.`;
  }
  return sentence;
}

