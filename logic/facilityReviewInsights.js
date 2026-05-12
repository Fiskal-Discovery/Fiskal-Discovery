// facilityReviewInsights.js
// Insight blocks for Facility Review results pages.
// Covers Invoice Finance, Business Loan, Asset Finance, Trade Finance, FX, Other.

// ---- GENERAL ----

function getFacilityReviewOpening(businessName, providerName) {
  const name = businessName || 'the business';

  if (providerName && providerName.trim()) {
    return `As your current facility is with ${providerName}, it would be worth reviewing the agreement properly to see whether the cost, structure, service and flexibility still work for ${name}.`;
  }
  return `Based on what you've told us, your current facility is worth reviewing properly. The aim is not just to see whether something cheaper exists, but to understand whether the structure, cost, flexibility and service still work for ${name}.`;
}

function getStuckInContractInsight() {
  return `If you feel stuck in the current contract, that does not always mean you have no options. Some facilities can be negotiated, refinanced or moved away from more smoothly than expected, and that is something worth exploring.`;
}

function getUnknownRatesInsight() {
  return `If you're not completely clear on what you're paying, that is not unusual. Many businesses are not fully aware of the true cost once fees, charges, minimums and other costs are included. That alone makes the facility worth reviewing properly.`;
}

// ---- INVOICE FINANCE ----

function getInvoiceFinanceReviewInsight(state, businessName) {
  const name = businessName || 'the business';
  const ifType = (state['if-type'] || state.ifType || '').toLowerCase();
  const sector = detectSector(businessName, '');
  const insights = [];

  // Spot funding note
  if (ifType.includes('spot')) {
    insights.push(`Because ${name} is using spot funding, it would be worth reviewing whether this is still the most cost-effective structure. Spot funding can be useful when funding individual invoices as needed, but it is generally more expensive than a selective or full ledger facility.`);
  }

  // Sector-specific notes
  if (sector === 'construction') {
    insights.push(`Construction invoice finance is a specialist area, and there are fewer lenders willing to support it because of the contractual nature of the work, staged payments and applications for payment. That said, limited lender choice does not mean ${name} should simply accept poor terms — there are still options in the market worth comparing properly.`);
  } else if (sector === 'recruitment') {
    insights.push(`Recruitment finance with back-office support is worth reviewing, because not all providers offer the same level of service. Some back-office options are mainly software-led, while others provide a more hands-on team that can support payroll, invoicing and administration more fully.`);
  }

  // Not sure what type
  if (!ifType || ifType === 'not sure') {
    insights.push(`If ${name} is not completely sure what type of Invoice Finance facility is currently in place, that alone is worth reviewing. Invoice Finance has many variations, and the details — including the funding limit, advance rate, service fee, discount rate, minimums and disbursements — can make a significant difference.`);
  }

  // Priorities note
  const priorities = state['if-priorities'] || state.ifPriorities || [];
  if (priorities.length > 0) {
    const priorityList = priorities.join(', ').toLowerCase();
    insights.push(`You've made it clear that ${priorityList} matter most. That is useful, because the review should not just focus on finding another finance arrangement — it should focus on finding one that actually addresses the issues that matter to ${name}.`);
  }

  return insights.slice(0, 2);
}

// ---- BUSINESS LOAN ----

function getLoanReviewInsight(state, businessName) {
  const name = businessName || 'the business';
  const outstanding = state.loanOutstanding || '';
  const repayment = state.loanRepayment || state.loanMonthlyCost || '';
  const priorities = state.loanPriorities || [];

  let para = `Your current loan is worth reviewing in the context of the monthly repayment, remaining balance, term and whether it still suits ${name}.`;

  if (repayment) {
    para += ` If the repayment is putting pressure on cashflow, or if ${name} now has several facilities running at once, refinancing or consolidating may be worth exploring.`;
  }

  const insights = [para];

  if (priorities.length > 0) {
    insights.push(`You've highlighted that ${priorities.join(', ').toLowerCase()} matter most for this review. Those are the right things to focus on — it is not just about finding a lower rate, but about making sure the whole structure works better for ${name}.`);
  }

  return insights.slice(0, 2);
}

// ---- ASSET FINANCE ----

function getAssetFinanceReviewInsight(state, businessName) {
  const name = businessName || 'the business';
  const upgrade = (state.assetUpgrade || '').toLowerCase();
  const valueChange = (state.assetValueChange || '').toLowerCase();

  let para = `Your current Asset Finance agreement is worth reviewing around the monthly repayment, remaining term, ownership position and whether the asset still supports ${name} in the right way.`;

  if (upgrade === 'yes' || upgrade.includes('upgrade') || upgrade.includes('replace')) {
    para += ` If ${name} is already considering upgrading or replacing the asset, that changes the review slightly — it may be worth looking at what options exist for the current agreement alongside what could be arranged for a replacement or additional asset.`;
  }

  if (valueChange === 'depreciated' || valueChange.includes('worth less')) {
    para += ` It is also worth considering whether the current structure still makes financial sense if the asset has depreciated significantly relative to what is outstanding.`;
  }

  return [para];
}

// ---- TRADE FINANCE ----

function getTradeFinanceReviewInsight(state, businessName) {
  const name = businessName || 'the business';
  const reachingLimit = (state.tradeReaching || '').toLowerCase();
  const growth = (state.tradeGrowth || '').toLowerCase();

  let para = `Your current Trade Finance facility is worth reviewing around the limit, fees, supplier terms, repayment timing and whether it still matches the way ${name} buys and sells. Trade Finance should help the business take on opportunities, not restrict orders or eat too heavily into margin.`;

  if (reachingLimit === 'yes' || reachingLimit.includes('limit') || reachingLimit.includes('capacity')) {
    para += ` If ${name} is reaching the current limit regularly, this is an important signal — it may mean the facility needs to be increased, or that the structure needs to be reconsidered to better match the trading cycle.`;
  }

  if (growth === 'yes' || growth.includes('grow') || growth.includes('expand')) {
    para += ` If growth is a priority, making sure the Trade Finance facility can scale with the business is worth addressing now rather than later.`;
  }

  return [para];
}

// ---- FX ----

function getFXReviewInsight(state, businessName) {
  const name = businessName || 'the business';
  const provider = (state.fxProvider || '').toLowerCase();
  const isBank = provider.includes('bank') || provider.includes('barclays')
    || provider.includes('lloyds') || provider.includes('natwest') || provider.includes('hsbc')
    || provider.includes('santander') || provider.includes('halifax') || provider.includes('monzo')
    || provider.includes('starling');

  let para = `Your current FX arrangement is worth reviewing if ${name} is regularly paying suppliers, receiving payments or holding exposure in different currencies. Even small differences in exchange rates, fees or timing can add up if currency transactions happen regularly.`;

  if (isBank) {
    para += ` If ${name} is mainly using its bank for foreign currency, it may be worth comparing this against specialist FX providers. Banks are convenient, but not always the most competitive option for regular currency requirements.`;
  }

  return [para];
}

// ---- OTHER FACILITY ----

function getOtherFacilityReviewInsight(state, businessName) {
  const name = businessName || 'the business';
  const fundingType = state.otherFundingType || 'current finance arrangement';
  const provider = state.otherFundingProvider || '';

  let para = `Because this is a more specific type of finance arrangement`;
  if (fundingType && fundingType !== 'current finance arrangement' && fundingType !== 'facility') para += ` — ${fundingType.toLowerCase()} —`;
  para += `, the first step is to understand exactly what it is, how much is outstanding or available, what it costs, and whether it is still helping ${name}.`;

  if (provider) {
    para += ` The current arrangement with ${provider} is worth comparing against what else might be available in the market.`;
  } else {
    para += ` Once that is clear, we can compare whether the current arrangement is still suitable or whether another structure may work better.`;
  }

  return [para];
}
