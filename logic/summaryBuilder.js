// summaryBuilder.js
// Builds personalised Discovery summaries for all four journeys.
//
// Usage:
//   const result = buildDiscoverySummary('funding-finder', answersObj);
//   result.pageHeading    — "Your Fiskal Discovery is ready"
//   result.summaryHeading — "Here's what we discovered"
//   result.summaryHtml    — HTML string for the summary card body
//   result.summaryText    — Plain text version (for email notifications)
//
// NOTE: This file depends on globalInsights.js, sectorInsights.js,
//       fundingFinderInsights.js, loanApplicationInsights.js,
//       facilityReviewInsights.js and shariahInsights.js being loaded first.

const PAGE_HEADING    = 'Your Fiskal Discovery is ready';
const SUMMARY_HEADING = 'Here\'s what we discovered';

function buildDiscoverySummary(route, answers) {
  let result;
  switch (route) {
    case 'funding-finder':
      result = buildFundingFinderSummary(answers);
      break;
    case 'loan-application':
      result = buildLoanApplicationSummary(answers);
      break;
    case 'facility-review-invoice':
      result = buildFacilityReviewSummary(answers, 'invoice');
      break;
    case 'facility-review-loan':
      result = buildFacilityReviewSummary(answers, 'loan');
      break;
    case 'facility-review-asset':
      result = buildFacilityReviewSummary(answers, 'asset');
      break;
    case 'facility-review-trade':
      result = buildFacilityReviewSummary(answers, 'trade');
      break;
    case 'facility-review-fx':
      result = buildFacilityReviewSummary(answers, 'fx');
      break;
    case 'facility-review-other':
      result = buildFacilityReviewSummary(answers, 'other');
      break;
    case 'shariah':
      result = buildShariahSummary(answers);
      break;
    default:
      result = buildFallbackSummary(answers);
  }
  return result;
}

// ============================================================
// FUNDING FINDER SUMMARY
// ============================================================
function buildFundingFinderSummary(answers) {
  const name        = answers.name || '';
  const business    = answers.business || 'the business';
  const industry    = answers.industry || '';
  const barrier     = answers.barrier || '';
  const barrierText = answers.barrierDetails || '';

  const blocks = [];

  // Opening - stronger, more specific
  const sectorNote = getSectorNote(business, industry);
  if (sectorNote) {
    blocks.push(`Great news — based on what you've told us, there are several funding options worth exploring for ${business}. Because ${sectorNote}, the right structure needs to take account of how work is completed, invoiced and paid.`);
  } else {
    blocks.push(`Great news — based on what you've told us, there are several funding options worth exploring for ${business}.`);
  }

  // Top 2 product insights
  const insights = getTopFundingFinderInsights(answers, business, industry);
  insights.forEach(i => blocks.push(i));

  // Credit concern
  if (hasCreditConcern(answers) || barrier === 'yes') {
    blocks.push(getCreditConcernInsight());
  }

  // No generic close - contact card handles follow-up

  const summaryText = blocks.join('\n\n');
  return {
    pageHeading:    PAGE_HEADING,
    summaryHeading: SUMMARY_HEADING,
    summaryHtml:    blocksToHtml(blocks),
    summaryText:    summaryText
  };
}

// ============================================================
// LOAN ENQUIRY SUMMARY
// ============================================================
function buildLoanApplicationSummary(answers) {
  const name     = answers.name || '';
  const business = answers.business || 'the business';
  const purpose  = answers.purpose || '';
  const amount   = answers.amount || '';
  const security = answers.security || '';
  const credit   = answers.credit || '';
  const turnover = answers.turnover || '';
  const existingFacilities = answers.existingFacilities || [];
  const barrier  = answers.barrier || '';
  const barrierDetails = answers.barrierDetails || '';
  const hasSecurityOrAsset = security && security !== 'None' && security !== 'Unsecured';

  const blocks = [];

  // Paragraph 1 — positive opening
  blocks.push(`Great news — based on what you've shared, there are still funding options worth exploring for ${business}. The key is finding the right structure for what the funding needs to achieve, rather than treating this as a generic loan enquiry.`);

  // Paragraph 2 — purpose insight + credit history + credit concern
  const purposeInsight = getLoanPurposeInsight(purpose, business);
  const creditHistoryInsight = getCreditHistoryInsight(credit);
  const creditConcern = getLoanCreditConcernInsight(barrier, barrierDetails, business);
  
  let para2 = '';
  if (purposeInsight) para2 += purposeInsight + ' ';
  if (creditHistoryInsight) para2 += creditHistoryInsight + ' ';
  if (creditConcern) para2 += creditConcern;
  if (para2) blocks.push(para2.trim());

  // Keep to 2 paragraphs max
  const finalBlocks = blocks.slice(0, 2);

  const summaryText = finalBlocks.join('\n\n');
  return {
    pageHeading:    PAGE_HEADING,
    summaryHeading: SUMMARY_HEADING,
    summaryHtml:    blocksToHtml(finalBlocks),
    summaryText:    summaryText
  };
}

// ============================================================
// FACILITY REVIEW SUMMARY
// ============================================================
function buildFacilityReviewSummary(answers, reviewType) {
  const name     = answers.name || '';
  const business = answers.business || 'the business';

  const blocks = [];

  // Opening
  let providerName = '';
  switch (reviewType) {
    case 'invoice': providerName = answers['if-lender-val'] || answers.ifLender || ''; break;
    case 'loan':    providerName = answers.loanLender || ''; break;
    case 'asset':   providerName = answers.assetProvider || ''; break;
    case 'trade':   providerName = answers.tradeProvider || ''; break;
    case 'fx':      providerName = answers.fxProvider || ''; break;
    case 'other':   providerName = answers.otherFundingProvider || ''; break;
  }
  blocks.push(getFacilityReviewOpening(business, providerName));

  // Review-type-specific insights
  let typeInsights = [];
  switch (reviewType) {
    case 'invoice': typeInsights = getInvoiceFinanceReviewInsight(answers, business); break;
    case 'loan':    typeInsights = getLoanReviewInsight(answers, business); break;
    case 'asset':   typeInsights = getAssetFinanceReviewInsight(answers, business); break;
    case 'trade':   typeInsights = getTradeFinanceReviewInsight(answers, business); break;
    case 'fx':      typeInsights = getFXReviewInsight(answers, business); break;
    case 'other':   typeInsights = getOtherFacilityReviewInsight(answers, business); break;
  }
  typeInsights.slice(0, 2).forEach(i => blocks.push(i));

  // Unknown costs note
  const ifKnowledge  = answers.ifKnowledge || '';
  const loanKnowledge = answers.loanKnowledge || '';
  const notSureCosts = ifKnowledge === 'Not sure' || loanKnowledge === 'Not sure';
  if (notSureCosts) blocks.push(getUnknownRatesInsight());

  // Practical close
  blocks.push(`The aim of the review is to make sure ${business} has the right facility at the right cost, with the service and flexibility that actually fits the way the business operates.`);

  const summaryText = blocks.join('\n\n');
  return {
    pageHeading:    PAGE_HEADING,
    summaryHeading: SUMMARY_HEADING,
    summaryHtml:    blocksToHtml(blocks),
    summaryText:    summaryText
  };
}

// ============================================================
// SHARIAH SUMMARY
// ============================================================
function buildShariahSummary(answers) {
  const purposes  = answers.purposes || [];
  const otherPurpose = answers.otherPurpose || '';
  const amount    = answers.amount || '';
  const notSure   = answers.notSure || amount === 'Not sure yet';
  const business  = answers.business || '';

  const blocks = [];

  // Paragraph 1 — opening sentence with purposes mentioned naturally
  blocks.push(getShariahOpeningInsight(business, purposes, otherPurpose));

  // Paragraph 2 — Shariah context + purpose-specific insight + amount sentence
  const purposeInsight = getShariahPurposeInsight(purposes, otherPurpose, business);
  const amountSentence = getShariahAmountInsight(amount, notSure);
  let para2 = `Shariah-compliant business funding can be more specialist and sometimes harder to source through mainstream routes, but that does not mean suitable options are out of reach. The key is understanding exactly what the funding needs to achieve, whether the amount required is realistic, and which providers may be able to support the business in a way that aligns more closely with Shariah-compliant principles.`;
  if (purposeInsight) para2 += ` ${purposeInsight}`;
  if (amountSentence) para2 += ` ${amountSentence}`;
  
  const summaryText = blocks.join('\n\n');
  return {
    pageHeading:    PAGE_HEADING,
    summaryHeading: SUMMARY_HEADING,
    summaryHtml:    blocksToHtml(blocks),
    summaryText:    summaryText
  };
}

// ============================================================
// FALLBACK SUMMARY
// ============================================================
function buildFallbackSummary(answers) {
  const business = answers.business || 'the business';
  const blocks = [
    `Based on what you've told us, there are funding options worth exploring for ${business}.`,
    `The next step is to review the details properly. Every business is different, and the best approach will depend on your specific situation, trading history and what you are trying to achieve.`
  ];
  return {
    pageHeading:    PAGE_HEADING,
    summaryHeading: SUMMARY_HEADING,
    summaryHtml:    blocksToHtml(blocks),
    summaryText:    blocks.join('\n\n')
  };
}

// ============================================================
// UTILITY
// ============================================================
function blocksToHtml(blocks) {
  return blocks
    .filter(Boolean)
    .map(b => `<p>${b.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}
