// shariahInsights.js
// Insight blocks for the Shariah-Compliant Funding results page.

function getShariahOpeningInsight(businessName, purpose) {
  const name = businessName || 'the business';

  let para = `Based on what you've told us, ${name} is looking for funding to support`;
  if (purpose && purpose !== 'Something else') {
    para += ` ${purpose.toLowerCase()}`;
  } else {
    para += ` a specific requirement`;
  }
  para += `. Because you are specifically looking for a Shariah-compliant route, this needs to be approached differently from a standard business loan or conventional finance application.`;

  return para;
}

function getShariahAmountInsight(amount, notSure) {
  if (notSure || !amount || amount === 'Not sure yet') {
    return `As you're not yet sure how much funding may be needed, the first step would be to work backwards from the purpose and identify a sensible funding range.`;
  }

  const parsed = parseMoneyString(amount);
  if (parsed) {
    const formatted = '\u00a3' + parsed.toLocaleString('en-GB');
    return `You've indicated that around ${formatted} may be needed, so this can be reviewed against the purpose, structure and provider criteria.`;
  }

  return null;
}

function getShariahPurposeInsight(purpose, businessName) {
  const name = businessName || 'the business';
  const p = (purpose || '').toLowerCase();

  if (p.includes('equipment') || p.includes('machinery') || p.includes('vehicle')
      || p.includes('asset') || p.includes('plant')) {
    return `If the funding is for equipment or assets, it may be worth exploring whether there are asset-based structures that could support the purchase in a more suitable way.`;
  }

  if (p.includes('growth') || p.includes('expand') || p.includes('expansion')
      || p.includes('hire') || p.includes('invest')) {
    return `If the aim is growth, the funding needs to support the next stage of ${name} without creating a structure that feels uncomfortable or unsuitable.`;
  }

  if (p.includes('working capital') || p.includes('cashflow') || p.includes('cash flow')
      || p.includes('wages') || p.includes('day to day')) {
    return `If the need is working capital, the focus should be on finding a structure that gives ${name} breathing room while still respecting the principles you are looking to work within.`;
  }

  if (p.includes('stock') || p.includes('inventory') || p.includes('trade')
      || p.includes('supplier') || p.includes('goods') || p.includes('purchase')) {
    return `If the funding is for stock or trade-related purchases, it may be worth exploring whether supplier, stock or trade-related structures could be available on a Shariah-compliant basis.`;
  }

  if (p.includes('property') || p.includes('premises') || p.includes('building')
      || p.includes('office') || p.includes('warehouse') || p.includes('commercial')) {
    return `If the funding relates to property or premises, this may need a more specialist review because property-backed funding can involve a longer and more detailed process, and the Shariah-compliant options in this area are more limited than in conventional finance.`;
  }

  if (p.includes('refinanc') || p.includes('consolidat') || p.includes('existing')) {
    return `If the aim is to refinance existing funding, the priority should be understanding what is currently in place and whether a more suitable structure could improve the position for ${name}.`;
  }

  return null;
}

// Utility — also defined in globalInsights but included here for standalone use
function parseMoneyString(value) {
  if (!value) return null;
  const cleaned = String(value)
    .replace(/[£$,\s]/g, '')
    .replace(/k$/i, '000')
    .replace(/m$/i, '000000');
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}
