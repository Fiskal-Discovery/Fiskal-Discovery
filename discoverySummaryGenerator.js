function formatMoney(value) {
  if (!value) return null;
  const num = Number(String(value).replace(/[^0-9.]/g, ""));
  if (!num) return null;
  return "£" + num.toLocaleString("en-GB");
}

function pick(options) {
  return options[Math.floor(Math.random() * options.length)];
}

export function generateDiscoverySummary(input = {}) {
  const business = input.businessName || "your business";
  const industry = input.industry || "your sector";
  const amount = formatMoney(input.fundingAmount);
  const turnover = formatMoney(input.turnover);

  const pain = input.mainChallenge || input.cashflowPressure || "cashflow pressure";
  const purpose = input.fundingPurpose || "supporting the next stage of the business";
  const urgency = input.urgency || "normal";
  const currentFunding = input.currentFunding || "your current funding setup";

  const opener = pick([
    `Based on what you've told us, ${business} appears to have a real opportunity to improve its funding structure.`,
    `${business} looks like a business where the right funding structure could make a meaningful difference.`,
    `Looking at your current position, there may be a better way to support ${business} financially.` 
  ]);

  const findings = [];

  if (turnover) {
    findings.push(`With turnover around ${turnover}, funding should be structured to support stability as well as growth.`);
  }

  if (amount) {
    findings.push(`You indicated a funding requirement of around ${amount}, which suggests this is more than a minor short-term need.`);
  }

  if (pain) {
    findings.push(`The main pressure point appears to be ${pain}, which can restrict flexibility if it is not dealt with properly.`);
  }

  if (input.repaymentPressure === "high") {
    findings.push("Existing repayments may be putting unnecessary strain on day-to-day cashflow.");
  }

  if (input.invoiceCustomers === true) {
    findings.push("Because your business works with invoice-paying customers, invoice finance may be worth exploring.");
  }

  if (input.cardSales === true) {
    findings.push("Because your business takes card payments, flexible revenue-linked funding may be relevant.");
  }

  if (input.assetNeed === true) {
    findings.push("There may be an opportunity to fund equipment or vehicles without using all available cash reserves.");
  }

  const recommendations = [];

  if (input.invoiceCustomers) recommendations.push("Invoice Finance");
  if (input.assetNeed) recommendations.push("Asset Finance");
  if (input.cardSales) recommendations.push("Merchant Cash Advance");
  if (input.propertySecurity) recommendations.push("Secured Business Funding");
  if (input.repaymentPressure === "high") recommendations.push("Refinance / Debt Restructure");

  if (!recommendations.length) {
    recommendations.push("Unsecured Business Loan", "Working Capital Funding");
  }

  let urgencyLine = "";
  if (urgency === "urgent") {
    urgencyLine = " Because the need appears urgent, speed and suitability will both matter. The wrong product could create more pressure later.";
  } else {
    urgencyLine = " Because this does not appear to be purely reactive, there may be time to compare options properly and structure the funding well.";
  }

  const summary = `${opener}

Your funding need is linked to ${purpose}, with ${pain} standing out as the key issue. ${industry !== "your sector" ? `In ${industry}, this kind of pressure can quickly affect working capital, supplier payments, and growth plans.` : ""}${urgencyLine}

The priority should be finding funding that fits the way ${business} actually trades, rather than forcing the business into a product that creates more pressure later.`;

  const nextStep = pick([
    `The next step is to review the figures properly and identify which lenders are most likely to suit ${business}.`,
    `A focused funding review would help narrow this down and avoid wasting time with unsuitable options.`,
    `Fiskal can review the position and help identify the most suitable route based on cost, speed, flexibility, and structure.` 
  ]);

  return {
    headline: `${business}: Funding Discovery Summary`,
    summary,
    keyFindings: findings,
    recommendedFundingTypes: recommendations,
    nextStep,
    confidenceNote: "This is an initial discovery summary, not a funding approval or formal offer. Final options depend on lender criteria, trading history, credit profile, and supporting documents."
  };
}
