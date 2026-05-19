// globalInsights.js
// Reusable insight blocks applied across all Discovery journeys.

// Detects whether credit concern language is present in any answer or barrier text.
function hasCreditConcern(answers) {
  // Direct flags from funding-finder flow
  if (answers.creditConcern === 'Yes') return true;
  if (answers.previousIssues === 'Yes') return true;

  const creditKeywords = [
    'bad credit', 'poor credit', 'ccj', 'default', 'defaults', 'missed payment',
    'arrears', 'declined', 'decline', 'previous decline', 'adverse credit',
    'credit concerns', 'repayment issues', 'late payments', 'county court',
    'insolvency', 'administration', 'iva', 'dmp', 'debt management',
    'credit problem', 'credit issue', 'credit history', 'bad history'
  ];
  const textFields = [
    answers.barrierDetails, answers.loanBarrierDetails,
    answers.assetBarrierDetails, answers.tradeBarrierDetails,
    answers.extraInfo
  ].filter(Boolean).join(' ').toLowerCase();
  return creditKeywords.some(kw => textFields.includes(kw));
}

function getCreditConcernInsight() {
  return `You've mentioned that there may be some credit concerns, CCJs, defaults or other issues that could affect an application. It is important to be realistic — some lenders may be cautious, and not every lender will be the right fit.

However, this does not automatically mean funding is not possible. Fiskal regularly works with businesses that have historic challenges, and there are flexible lenders who may be prepared to look at the full picture when the funding purpose makes sense.`;
}

// Returns true if the user indicated they are a new start business.
function isNewStart(answers) {
  return (answers.annualTurnover || answers.turnover || '') === 'New start';
}

// Returns a varied new-start acknowledgement phrase (never the same one twice in a session).
const _newStartPhrases = [
  "As a new business, your options may be more limited right now — but the right foundations today set you up for much more tomorrow.",
  "Starting out is the hardest part — but there are lenders who specifically back new businesses with the right proposition.",
  "As a new start, lenders will focus heavily on your projected turnover and business plan — Nicole will help you put your best foot forward.",
  "New businesses face more scrutiny from lenders, but that doesn't mean doors are closed — it just means finding the right ones.",
  "Every established business was once a new start — Nicole will work with you to find the options available at this stage of your journey.",
  "Being new to trading actually opens some doors that aren't available to established businesses — Nicole will explore all the options with you."
];
let _lastNewStartIdx = -1;
function getNewStartInsight() {
  let idx;
  do { idx = Math.floor(Math.random() * _newStartPhrases.length); } while (idx === _lastNewStartIdx && _newStartPhrases.length > 1);
  _lastNewStartIdx = idx;
  return _newStartPhrases[idx];
}

// Compares requested funding amount against stated turnover.
// Returns an insight string if worth noting, or null if no issue.
function getFundingAmountInsight(fundingAmount, turnover, hasSecurityOrAsset) {
  const amount = parseMoneyString(fundingAmount);
  const tv = parseMoneyString(turnover);

  if (!amount || !tv) return null;

  const ratio = amount / tv;

  if (ratio >= 0.5 && !hasSecurityOrAsset) {
    return `Being honest, the amount requested looks high compared with the turnover provided, especially if no security is available. A standard unsecured loan at that level may be difficult to achieve. The better approach may be to understand exactly why that level of funding is needed and whether the requirement can be structured differently.`;
  }

  if (ratio < 0.5) {
    return `The amount requested appears more proportionate to the turnover provided, although affordability, trading history and lender criteria would still need to be checked properly.`;
  }

  return null;
}

function getNotSureAmountInsight() {
  return `As you're not yet sure how much funding may be required, that is completely fine. The first step is to understand what the funding needs to achieve, then work backwards to a sensible range.`;
}

// Utility: parse a money string or band like "£50,000", "50k", "£100k–£250k" into a number.
// For band strings (containing '–'), returns the midpoint.
function parseMoneyString(value) {
  if (!value) return null;
  const s = String(value);

  // Handle range/band strings by taking midpoint
  const rangeSep = s.match(/[–\-]/);
  if (rangeSep && s.includes('–') || (s.includes('-') && s.replace(/[^-]/g,'').length === 1 && !s.startsWith('-'))) {
    const parts = s.split(/[–\-]/).map(p => parseMoneyString(p.trim())).filter(Boolean);
    if (parts.length === 2) return Math.round((parts[0] + parts[1]) / 2);
    if (parts.length === 1) return parts[0];
  }

  // Handle "+" suffix (e.g. "£500k+") — treat as lower bound
  const cleaned = s
    .replace(/[£$,\s+]/g, '')
    .replace(/k/gi, '000')
    .replace(/m/gi, '000000')
    .replace(/under|less\s*than|<|>/gi, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}
