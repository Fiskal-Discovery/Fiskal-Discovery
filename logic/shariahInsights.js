// shariahInsights.js
// Insight blocks for the Shariah-Compliant Funding results page.

function getShariahOpeningInsight(businessName, purposes, otherPurpose) {
  const name = businessName || 'the business';
  const purposeText = otherPurpose || (Array.isArray(purposes) ? purposes.join(' and ') : purposes);

  let para = `Based on what you've told us, ${name} is looking for Shariah-compliant funding to support`;
  if (purposeText && purposeText !== 'Something else') {
    para += ` ${purposeText.toLowerCase()}`;
  } else {
    para += ` a specific requirement`;
  }
  para += `. This needs to be approached differently from a standard business loan or conventional finance application.`;

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
  
  // Combine multiple insights naturally
  return insights.slice(0, 2).join(' ');
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
