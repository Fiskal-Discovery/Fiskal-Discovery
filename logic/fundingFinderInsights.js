// fundingFinderInsights.js
// Personalised insight blocks for the Funding Finder results page.

// ============================================================
// HELPERS
// ============================================================

function parsePaymentTermsDays(paymentTerms) {
  if (!paymentTerms) return null;
  const t = String(paymentTerms).toLowerCase();
  if (t.includes('90+') || t.includes('90 +')) return 90;
  if (t.includes('90')) return 90;
  if (t.includes('60')) return 60;
  if (t.includes('30')) return 30;
  return null;
}

function getSectorDefaultDays(industry) {
  const s = (industry || '').toLowerCase();
  if (s.includes('construction') || s.includes('build') || s.includes('contractor')) return 60;
  if (s.includes('recruitment') || s.includes('staffing')) return 30;
  if (s.includes('transport') || s.includes('haulage') || s.includes('logistics')) return 45;
  if (s.includes('healthcare') || s.includes('care')) return 45;
  if (s.includes('manufacturing') || s.includes('engineering')) return 45;
  if (s.includes('wholesale')) return 45;
  return null;
}

function formatCurrency(n) {
  if (n >= 1000000) return '£' + (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  if (n >= 1000) return '£' + Math.round(n / 1000) + 'k';
  return '£' + Math.round(n).toLocaleString('en-GB');
}

function isRDSector(industry) {
  const s = (industry || '').toLowerCase();
  return ['manufacturing', 'construction', 'healthcare', 'medtech', 'software', 'tech',
          'engineering', 'food', 'renewable', 'pharma'].some(k => s.includes(k));
}

// ============================================================
// INVOICE FINANCE
// ============================================================

function getInvoiceFinanceInsight(answers, businessName, industry) {
  const val = answers.invoice;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  const turnover = parseMoneyString(answers.turnover);
  const sector = detectSector(businessName, industry);
  const termsDays = parsePaymentTermsDays(answers.paymentTerms) || getSectorDefaultDays(industry);
  const isConstruction = sector === 'construction';

  if (turnover && turnover >= 50000 && termsDays) {
    const debtorBook = Math.round((turnover / 365) * termsDays);
    const advanceLow = Math.round(debtorBook * (isConstruction ? 0.50 : 0.90));
    const advanceHigh = isConstruction ? Math.round(debtorBook * 0.80) : null;
    const advanceText = advanceHigh
      ? `${formatCurrency(advanceLow)}–${formatCurrency(advanceHigh)}`
      : formatCurrency(advanceLow);
    const termLabel = termsDays >= 90 ? '90' : termsDays >= 60 ? '60' : '30';

    let para = `Right now, every invoice you raise sits unpaid for around ${termLabel} days. That's money already earned — just not collected yet. `;

    if (isConstruction) {
      para += `Contractual invoices are more complex for lenders due to retention clauses and application-based billing, so advance rates typically sit between 50–80% rather than the standard 90% — but even so, that's roughly ${advanceText} from a debtor book of around ${formatCurrency(debtorBook)} that could be in your account within 24 hours of raising an invoice. `;
    } else {
      para += `Based on a turnover of ${formatCurrency(turnover)} and ${termLabel}-day terms, you likely have around ${formatCurrency(debtorBook)} sitting in unpaid invoices at any given time. Invoice finance could release around ${advanceText} of that within 24 hours of invoicing — not the day a customer decides to pay. `;
    }

    para += `A facility can typically be set up in 5–10 working days. Once live, that cash is available the same day you invoice.`;
    return para;
  }

  if (!turnover) {
    return `Right now, every invoice you raise sits unpaid until the customer decides to pay. Invoice finance changes that — funds are released within 24 hours of raising an invoice, not 30, 60 or 90 days later. If you share your turnover, I can give you a real idea of how much could be sitting untapped right now. A facility can typically be set up in 5–10 working days.`;
  }

  // Sector-specific fallback
  const sectorInsight = getSectorInvoiceFinanceInsight(businessName, industry);
  if (sectorInsight) return sectorInsight;

  return `Invoice finance may be worth exploring for ${name}. Cash tied up in unpaid invoices can be released within 24 hours of invoicing rather than waiting 30, 60 or 90 days for customers to pay. A facility can typically be set up in 5–10 working days.`;
}

// ============================================================
// TRADE FINANCE
// ============================================================

function getTradeFinanceInsight(answers, businessName) {
  const val = answers.trade;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  const turnover = parseMoneyString(answers.turnover);

  if (turnover && turnover >= 50000) {
    const facilityLow = Math.round(turnover * 0.10);
    const facilityHigh = Math.round(turnover * 0.15);
    const savingLow = Math.round(facilityLow * 0.02);
    const savingHigh = Math.round(facilityHigh * 0.05);

    return `Most businesses don't realise their suppliers will offer better prices for upfront payment — they just never ask. Trade finance lets you pay like a cash buyer without tying up your own capital. Based on your turnover, a facility of around ${formatCurrency(facilityLow)}–${formatCurrency(facilityHigh)} is a reasonable starting point. Early payment discounts from suppliers typically run at 2–5% of the facility value — that's a potential saving of ${formatCurrency(savingLow)}–${formatCurrency(savingHigh)} a year, often enough to offset the cost of the facility entirely. It also means never turning down a large order because you can't fund the stock. First facilities typically take 2–3 weeks to set up; once live, supplier payments can be made the same day.`;
  }

  return `Most businesses don't realise their suppliers will offer better prices for upfront payment — they just never ask. Trade finance lets you pay like a cash buyer without tying up your own capital. It means never turning down a large order because the stock can't be funded, and supplier relationships improve when you're known as someone who pays on time. First facilities typically take 2–3 weeks to set up; once live, supplier payments can be made the same day.`;
}

// ============================================================
// ASSET FINANCE
// ============================================================

function getAssetFinanceInsight(answers, businessName) {
  const val = answers.asset;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  const amount = parseMoneyString(answers.fundingAmount);

  if (amount && amount >= 1000) {
    const m36 = formatCurrency(Math.round(amount / 36));
    const m48 = formatCurrency(Math.round(amount / 48));
    const m60 = formatCurrency(Math.round(amount / 60));

    return `The equipment or vehicles you need shouldn't have to wait until there's enough cash saved. Instead of committing ${formatCurrency(amount)} today, asset finance could spread that across monthly payments — roughly ${m36}/month over 3 years, ${m48}/month over 4 years, or ${m60}/month over 5 years. The asset is working for your business from day one, generating revenue while you're still paying for it. Because the finance is secured against the asset itself, credit history is less of a barrier than with an unsecured loan. Decisions often come through within 24–48 hours, with funds or the asset available in as little as 3–5 working days.`;
  }

  return `The equipment or vehicles you need shouldn't have to wait until there's enough cash saved. Asset finance spreads the cost into manageable monthly payments, keeps working capital free for day-to-day operations, and means the asset is generating revenue from day one. Because the finance is secured against the asset itself, credit history is less of a barrier than with an unsecured loan. Decisions often come through within 24–48 hours, with funds or the asset available in as little as 3–5 working days.`;
}

// ============================================================
// BUSINESS LOAN
// ============================================================

function getBusinessLoanInsight(answers, businessName) {
  const val = answers.loan;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  const rawPurpose = answers.fundingPurpose || '';
  const purposes = Array.isArray(rawPurpose) ? rawPurpose : rawPurpose.split(',').map(s => s.trim()).filter(Boolean);
  const purposeText = purposes.length > 0 ? purposes.join(', ').toLowerCase() : null;

  let para = `A business loan gives you one clean injection of capital — no drip feed, no waiting. `;
  if (purposeText) {
    para += `Based on what you've shared, the funding is needed for ${purposeText}. Having that capital available changes what's possible — the right loan at the right time can be the difference between taking an opportunity and watching someone else take it. `;
  } else {
    para += `Whatever it needs to achieve, having that capital available changes what's possible. `;
  }
  para += `Some lenders can approve and fund within 24–48 hours. More involved applications typically take 5–10 working days. Nicole will know which lenders move fastest for your specific circumstances.`;

  if (answers.barrier === 'yes' || answers.barrierDetails) {
    para += ` Credit history doesn't automatically rule this out — there are lenders who look at the whole picture, not just a score.`;
  }

  para += ` Before committing to a fixed loan, it's also worth comparing with a Revolving Credit Facility — a credit line that only costs when you draw from it, with no fixed repayments on funds sitting idle. For businesses where cash needs vary month to month, it can work out considerably cheaper long term.`;

  return para;
}

// ============================================================
// PROPERTY FINANCE
// ============================================================

function getPropertyFinanceInsight(answers, businessName) {
  const val = answers.property;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  return `Property finance may be worth exploring for ${name}. If the funding need is linked to buying premises, refinancing property, refurbishment, development or raising funds against an existing asset, a property-backed facility may be more suitable than a standard unsecured loan. A commercial mortgage could be the longer-term route, although this is usually a more detailed process. If timing is important, bridging finance may also be worth considering while the longer-term structure is arranged.`;
}

// ============================================================
// REVOLVING CREDIT
// ============================================================

function getRevolvingCreditInsight(answers, businessName) {
  const val = answers.revolving;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  const turnover = parseMoneyString(answers.turnover);

  if (turnover && turnover >= 50000) {
    const facilityLow = formatCurrency(Math.round(turnover * 0.10));
    const facilityHigh = formatCurrency(Math.round(turnover * 0.15));

    return `Imagine never having to say no to an opportunity because the timing was wrong. Based on your turnover, you could likely access a revolving credit facility of around ${facilityLow}–${facilityHigh} — available when you need it, and costing nothing when you don't. It sits in the background, invisible until required, then available same day or next day once live. Setup typically takes 1–2 weeks. Whether it's smoothing a seasonal cashflow dip, jumping on a stock opportunity, or covering payroll ahead of a big client payment — the facility is there without having to reapply each time.`;
  }

  return `Imagine never having to say no to an opportunity because the timing was wrong. A revolving credit facility sits in the background — available when you need it, and costing nothing when you don't. Once live, drawdowns are available same day or next day. Setup typically takes 1–2 weeks. Whether it's smoothing a seasonal cashflow dip, jumping on a stock opportunity, or covering payroll — the facility is there without having to reapply each time.`;
}

// ============================================================
// MERCHANT CASH ADVANCE
// ============================================================

function getMerchantCashAdvanceInsight(answers, businessName) {
  const val = answers.mca;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  const turnover = parseMoneyString(answers.turnover);

  if (turnover && turnover >= 50000) {
    const monthlyCard = Math.round(turnover * 0.6 / 12);
    const advance = Math.round(monthlyCard * 1.2);
    if (advance >= 5000) {
      return `If you take regular card payments, a Merchant Cash Advance could provide around ${formatCurrency(advance)} based on a typical month's card revenue — repaid automatically as a small percentage of future card transactions, so repayments flex with the business. It is important to be honest: Merchant Cash Advances can be more expensive than other options, so it should normally be considered after checking whether invoice finance, a revolving facility or a loan could work more cost-effectively.`;
    }
  }

  return `A Merchant Cash Advance may be worth considering if you take regular card payments. It provides funding upfront, with repayments taken automatically as a small percentage of future card transactions. It is important to be honest: Merchant Cash Advances can be more expensive than other options, so it should normally be considered after checking whether invoice finance, a revolving facility or a loan could work more cost-effectively.`;
}

// ============================================================
// R&D TAX CREDITS
// ============================================================

function getRDTaxCreditInsight(answers, businessName, industry) {
  const val = answers.rd;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  const sectorMatch = isRDSector(industry);
  const sectorLine = sectorMatch
    ? `Businesses in this sector are among the most likely to qualify — often without realising it. `
    : ``;

  return `Most businesses that qualify for R&D Tax Credits have never claimed — either because they didn't know they qualified, or because they didn't realise what counts as R&D in HMRC's eyes. It's not just lab coats and scientists. If you've developed a new process, solved a technical problem, improved a product, or built something that didn't exist before — it may already be owed money. ${sectorLine}The SME scheme can return up to 33p for every £1 of qualifying spend. The average SME claim is £53,000 — that's not a rebate, that's a cheque. HMRC also allows claims for the previous two accounting years, so there could already be money sitting there. Claims are typically paid within 28–40 days of submission. Fiskal works with trusted accountants who take a careful, evidence-led approach — no upfront charge, payment only on a successful claim.`;
}

// ============================================================
// FX
// ============================================================

function getFXInsight(answers, businessName) {
  const val = answers.fx;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  const turnover = parseMoneyString(answers.turnover);

  if (turnover && turnover >= 50000) {
    const fxExposureLow = Math.round(turnover * 0.20);
    const fxExposureHigh = Math.round(turnover * 0.30);
    const bankCostLow = Math.round(fxExposureLow * 0.025);
    const bankCostHigh = Math.round(fxExposureHigh * 0.035);
    const specialistCostHigh = Math.round(fxExposureHigh * 0.005);
    const savingLow = Math.round(bankCostLow - specialistCostHigh);

    return `Your bank isn't showing you a fee on foreign currency — it doesn't have to. The margin is built into the exchange rate, and most businesses never notice it as a line item. High street banks typically charge 2.5–3.5% on currency conversion. On estimated annual FX volumes of ${formatCurrency(fxExposureLow)}–${formatCurrency(fxExposureHigh)}, that's quietly costing ${formatCurrency(bankCostLow)}–${formatCurrency(bankCostHigh)} a year. Specialist FX providers charge 0.1–0.5% — near-interbank rates — and also offer forward contracts to lock in today's rate for future payments, removing currency risk entirely. Switching typically takes the same week with no disruption to existing banking. The saving usually surprises people.`;
  }

  return `Your bank isn't showing a fee on foreign currency — it doesn't have to. The margin is built into the exchange rate, and most businesses never notice it as a line item. High street banks typically charge 2.5–3.5% on currency conversion; specialist providers charge 0.1–0.5%. On £100k of international transactions, that difference is £2,000–£3,400 a year quietly disappearing. Specialist providers also offer forward contracts to lock in today's rate for future payments, removing currency risk entirely. Switching typically takes the same week with no disruption to existing banking.`;
}

// ============================================================
// NORMALISE PRODUCT KEY
// ============================================================

function normaliseFundingProduct(product) {
  const key = String(product || '').toLowerCase().trim();
  const map = {
    'invoice': 'invoice-finance',
    'invoice finance': 'invoice-finance',
    'trade': 'trade-finance',
    'trade finance': 'trade-finance',
    'asset': 'asset-finance',
    'asset finance': 'asset-finance',
    'loan': 'business-loan',
    'business loan': 'business-loan',
    'business loans': 'business-loan',
    'revolving': 'revolving-credit',
    'revolving credit': 'revolving-credit',
    'revolving credit facility': 'revolving-credit',
    'mca': 'merchant-cash-advance',
    'merchant cash advance': 'merchant-cash-advance',
    'property': 'property-finance',
    'property finance': 'property-finance',
    'commercial property finance': 'property-finance',
    'fx': 'fx',
    'foreign currency / fx': 'fx',
    'foreign currency': 'fx',
    'rd': 'r-and-d',
    'rnd': 'r-and-d',
    'r&d': 'r-and-d',
    'r&d tax credits': 'r-and-d'
  };
  return map[key] || key;
}

// ============================================================
// SOFT MATCH MENTION LINE
// ============================================================

// Priority order for capping soft mentions (from the brief)
const SOFT_MENTION_PRIORITY = ['invoice','asset','loan','revolving','rd','trade','property','fx','mca','debtRecovery'];

const SOFT_PRODUCT_NAMES = {
  invoice:      'Invoice Finance',
  asset:        'Asset Finance',
  loan:         'a Business Loan',
  revolving:    'a Revolving Credit Facility',
  rd:           'R&D Tax Credits',
  trade:        'Trade Finance',
  property:     'Commercial Property Finance',
  fx:           'FX (Foreign Currency)',
  mca:          'Merchant Cash Advance',
  debtRecovery: 'Debt Recovery',
};

function getSoftFundingMentionLine(softProductKeys) {
  if (!softProductKeys || softProductKeys.length === 0) return null;
  const capped = [...softProductKeys]
    .sort((a, b) => {
      const ai = SOFT_MENTION_PRIORITY.indexOf(a);
      const bi = SOFT_MENTION_PRIORITY.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    })
    .slice(0, 3)
    .map(k => SOFT_PRODUCT_NAMES[k] || k);
  if (capped.length === 0) return null;
  if (capped.length === 1) {
    return `${capped[0]} could also be worth discussing with Nicole, depending on how your situation develops.`;
  }
  const last = capped[capped.length - 1];
  const rest = capped.slice(0, -1);
  return `Depending on your situation, ${rest.join(', ')} and ${last} may also be worth exploring — Nicole can talk through any of these with you.`;
}

// ============================================================
// TOP 2 INSIGHTS — priority ordered
// ============================================================

function getTopFundingFinderInsights(answers, businessName, industry) {
  const candidates = [];
  const matchedProducts = answers.matchedProducts || [];
  const hasMatchedProducts = matchedProducts.length > 0;
  const normalisedProducts = matchedProducts.map(normaliseFundingProduct);

  const productInsightMap = [
    { key: 'invoice-finance',       priority: 100, fn: () => getInvoiceFinanceInsight(answers, businessName, industry) },
    { key: 'trade-finance',         priority: 90,  fn: () => getTradeFinanceInsight(answers, businessName) },
    { key: 'asset-finance',         priority: 85,  fn: () => getAssetFinanceInsight(answers, businessName) },
    { key: 'revolving-credit',      priority: 80,  fn: () => getRevolvingCreditInsight(answers, businessName) },
    { key: 'business-loan',         priority: 75,  fn: () => getBusinessLoanInsight(answers, businessName) },
    { key: 'property-finance',      priority: 70,  fn: () => getPropertyFinanceInsight(answers, businessName) },
    { key: 'r-and-d',               priority: 65,  fn: () => getRDTaxCreditInsight(answers, businessName, industry) },
    { key: 'merchant-cash-advance', priority: 50,  fn: () => getMerchantCashAdvanceInsight(answers, businessName) },
    { key: 'fx',                    priority: 40,  fn: () => getFXInsight(answers, businessName) },
  ];

  if (hasMatchedProducts) {
    productInsightMap
      .filter(p => normalisedProducts.includes(p.key))
      .sort((a, b) => b.priority - a.priority)
      .forEach(p => {
        const insight = p.fn();
        if (insight) candidates.push(insight);
      });
  } else {
    productInsightMap.forEach(p => {
      const insight = p.fn();
      if (insight) candidates.push(insight);
    });
  }

  return candidates.slice(0, 2);
}
