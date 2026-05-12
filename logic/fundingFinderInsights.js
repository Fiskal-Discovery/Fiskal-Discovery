// fundingFinderInsights.js
// Insight blocks for the Funding Finder results page.
// Each function takes the answers state and business name/industry and returns
// a paragraph string (or null if not applicable).

function getInvoiceFinanceInsight(answers, businessName, industry) {
  const val = answers.invoice;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  const type = answers.invoice_type;

  // Sector-specific version takes priority
  const sectorInsight = getSectorInvoiceFinanceInsight(businessName, industry);
  if (sectorInsight) return sectorInsight;

  let para = `Invoice Finance may be worth exploring for ${name} because the business appears to wait for customers to pay invoices. If cash is tied up for 30, 60 or even 90 days, this type of facility could help release money earlier and give the business more breathing room.`;

  if (type === 'selective') {
    para += ` You've indicated a preference for selective funding — funding individual invoices as needed rather than all of them at once — which gives more flexibility, although it is worth noting that selective facilities are generally slightly more expensive per invoice than a full ledger arrangement.`;
  }

  return para;
}

function getTradeFinanceInsight(answers, businessName) {
  const val = answers.trade;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  const hasInvoice = answers.invoice === 'yes' || answers.invoice === 'maybe';

  let para = `Trade Finance may be worth exploring for ${name}. It can provide a funding line to help pay suppliers upfront, which may be useful if the business needs to purchase stock, materials or goods before customer payments come back in. This could help fulfil more orders without tying up all available cash, and may also improve buying power if suppliers offer better terms or discounts for upfront payment.`;

  if (!hasInvoice) {
    para += ` Trade Finance and Invoice Finance can also work well together: Trade Finance helps pay the supplier, the goods are sold and invoiced, Invoice Finance helps repay the trade facility, and the customer then repays the invoice facility.`;
  }

  return para;
}

function getAssetFinanceInsight(answers, businessName) {
  const val = answers.asset;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  return `Asset Finance may be worth exploring for ${name} because equipment, machinery, vehicles or other business-critical assets can be difficult to purchase outright. Rather than using a large amount of cash upfront, this type of funding could help the business access what it needs and spread the cost over time, through a leasing or hire purchase-style arrangement.`;
}

function getBusinessLoanInsight(answers, businessName) {
  const val = answers.loan;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  return `A business loan may be worth exploring if ${name} needs a lump sum to support cashflow, growth, suppliers, wages or general working capital. It could give the business a useful injection of capital to support the next stage without relying on cash that is needed elsewhere.`;
}

function getPropertyFinanceInsight(answers, businessName) {
  const val = answers.property;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  return `Property Finance may be worth exploring for ${name}. If the funding need is linked to buying premises, refinancing property, refurbishment, development or raising funds against an existing asset, a property-backed facility may be more suitable than a standard unsecured loan. A commercial mortgage could be the longer-term route, although this is usually a more detailed process. If timing is important, bridging finance may also be worth considering while the longer-term structure is arranged.`;
}

function getRevolvingCreditInsight(answers, businessName) {
  const val = answers.revolving;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  return `A Revolving Credit Facility may be worth exploring for ${name}. It can provide access to a flexible funding line rather than a single fixed loan, which may be useful if the business needs cash available for different purposes at different times — whether for creditor invoices, working capital, or handling short-term pressure.`;
}

function getMerchantCashAdvanceInsight(answers, businessName) {
  const val = answers.mca;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  return `A Merchant Cash Advance may be worth considering if ${name} takes regular card payments from customers. It provides funding upfront, with repayments usually taken in small increments from future card transactions. It is important to be honest: Merchant Cash Advances can be expensive compared with other funding options, so it should normally be treated as a fallback after checking whether a loan, revolving facility or Invoice Finance could work more cost-effectively.`;
}

function getRDTaxCreditInsight(answers, businessName) {
  const val = answers.rd;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  return `R&D Tax Credits may be worth exploring for ${name}. Many businesses that are eligible do not realise they qualify, especially where they have spent time improving products, processes, systems, software or technical ways of working. Fiskal works with trusted accountants who take a careful, evidence-led approach — they do not charge anything upfront, and payment is only due if a successful refund or benefit is secured. If eligible, this could provide a welcome cash boost without taking on new borrowing.`;
}

function getFXInsight(answers, businessName) {
  const val = answers.fx;
  if (val !== 'yes' && val !== 'maybe') return null;

  const name = businessName || 'the business';
  return `Foreign currency may be worth reviewing for ${name} if the business regularly sends or receives payments in other currencies. Most businesses using their bank for foreign currency have no clear idea how much is quietly being taken on each transaction through exchange rates and fees. Even small differences can add up materially over time.`;
}

function normaliseFundingProduct(product) {
  const key = String(product || "").toLowerCase().trim();

  const map = {
    "invoice": "invoice-finance",
    "invoice finance": "invoice-finance",

    "trade": "trade-finance",
    "trade finance": "trade-finance",

    "asset": "asset-finance",
    "asset finance": "asset-finance",

    "loan": "business-loan",
    "business loan": "business-loan",
    "business loans": "business-loan",

    "revolving": "revolving-credit",
    "revolving credit": "revolving-credit",
    "revolving credit facility": "revolving-credit",

    "mca": "merchant-cash-advance",
    "merchant cash advance": "merchant-cash-advance",

    "property": "property-finance",
    "property finance": "property-finance",
    "commercial property finance": "property-finance",

    "fx": "fx",
    "foreign currency / fx": "fx",
    "foreign currency": "fx",

    "rd": "r-and-d",
    "rnd": "r-and-d",
    "r&d": "r-and-d",
    "r&d tax credits": "r-and-d"
  };

  return map[key] || key;
}

// Returns the two strongest matched product insights for a given answers object.
// Priority order follows commercial relevance and match strength.
function getTopFundingFinderInsights(answers, businessName, industry) {
  const candidates = [];
  
  // Check if matchedProducts is provided
  const matchedProducts = answers.matchedProducts || [];
  const hasMatchedProducts = matchedProducts.length > 0;
  
  // Normalise product keys
  const normalisedProducts = matchedProducts.map(normaliseFundingProduct);
  
  // If matchedProducts is provided, only include insights for matched products
  if (hasMatchedProducts) {
    const candidatesWithPriority = [];
    
    // Check normalised products and add corresponding insights with priority
    if (normalisedProducts.includes("invoice-finance")) {
      const insight = getInvoiceFinanceInsight(answers, businessName, industry);
      if (insight) {
        candidatesWithPriority.push({
          product: "Invoice Finance",
          priority: 100,
          insight: insight
        });
      } else {
        // Fallback if insight function returns null
        candidatesWithPriority.push({
          product: "Invoice Finance",
          priority: 100,
          insight: `Invoice Finance may be worth exploring, especially if ${businessName} waits for customers or contractors to pay invoices. For construction-related businesses, it may be worth looking at specialist facilities that can support contractual invoices, applications for payment or staged payments, where standard invoice finance may not always fit neatly.`
        });
      }
    }
    
    if (normalisedProducts.includes("trade-finance")) {
      const insight = getTradeFinanceInsight(answers, businessName);
      if (insight) {
        candidatesWithPriority.push({
          product: "Trade Finance",
          priority: 90,
          insight: insight
        });
      } else {
        candidatesWithPriority.push({
          product: "Trade Finance",
          priority: 90,
          insight: `Trade Finance may be useful if ${businessName} needs to pay suppliers upfront for materials, stock or goods before customer payments come back in. This can help the business fulfil orders without tying up all available cash.`
        });
      }
    }
    
    if (normalisedProducts.includes("asset-finance")) {
      const insight = getAssetFinanceInsight(answers, businessName);
      if (insight) {
        candidatesWithPriority.push({
          product: "Asset Finance",
          priority: 85,
          insight: insight
        });
      } else {
        candidatesWithPriority.push({
          product: "Asset Finance",
          priority: 85,
          insight: `Asset Finance may be worth exploring if ${businessName} needs equipment, machinery, vehicles or other business-critical assets without using a large amount of cash upfront.`
        });
      }
    }
    
    if (normalisedProducts.includes("revolving-credit")) {
      const insight = getRevolvingCreditInsight(answers, businessName);
      if (insight) {
        candidatesWithPriority.push({
          product: "Revolving Credit Facility",
          priority: 80,
          insight: insight
        });
      } else {
        candidatesWithPriority.push({
          product: "Revolving Credit Facility",
          priority: 80,
          insight: `A Revolving Credit Facility may be useful where ${businessName} needs flexible access to cash for different purposes, such as supplier invoices, working capital or short-term pressure.`
        });
      }
    }
    
    if (normalisedProducts.includes("business-loan")) {
      const insight = getBusinessLoanInsight(answers, businessName);
      if (insight) {
        candidatesWithPriority.push({
          product: "Business Loan",
          priority: 75,
          insight: insight
        });
      } else {
        candidatesWithPriority.push({
          product: "Business Loan",
          priority: 75,
          insight: `A business loan may be worth exploring if ${businessName} needs a lump sum to support cashflow, growth, suppliers, wages or general working capital.`
        });
      }
    }
    
    if (normalisedProducts.includes("property-finance")) {
      const insight = getPropertyFinanceInsight(answers, businessName);
      if (insight) {
        candidatesWithPriority.push({
          product: "Property Finance",
          priority: 70,
          insight: insight
        });
      }
    }
    
    if (normalisedProducts.includes("r-and-d")) {
      const insight = getRDTaxCreditInsight(answers, businessName);
      if (insight) {
        candidatesWithPriority.push({
          product: "R&D Tax Credits",
          priority: 65,
          insight: insight
        });
      }
    }
    
    if (normalisedProducts.includes("merchant-cash-advance")) {
      const insight = getMerchantCashAdvanceInsight(answers, businessName);
      if (insight) {
        candidatesWithPriority.push({
          product: "Merchant Cash Advance",
          priority: 50,
          insight: insight
        });
      }
    }
    
    if (normalisedProducts.includes("fx")) {
      const insight = getFXInsight(answers, businessName);
      if (insight) {
        candidatesWithPriority.push({
          product: "Foreign Currency",
          priority: 40,
          insight: insight
        });
      }
    }
    
    // Sort by priority (highest first) and take top 2
    candidatesWithPriority.sort((a, b) => b.priority - a.priority);
    const topCandidates = candidatesWithPriority.slice(0, 2);
    topCandidates.forEach(c => candidates.push(c.insight));
  } else {
    // Fall back to checking individual answer fields
    candidates.push(
      getInvoiceFinanceInsight(answers, businessName, industry),
      getTradeFinanceInsight(answers, businessName),
      getAssetFinanceInsight(answers, businessName),
      getBusinessLoanInsight(answers, businessName),
      getPropertyFinanceInsight(answers, businessName),
      getRevolvingCreditInsight(answers, businessName),
      getRDTaxCreditInsight(answers, businessName),
      getMerchantCashAdvanceInsight(answers, businessName),
      getFXInsight(answers, businessName)
    ).filter(Boolean);
  }
  
  // Return top 2
  return candidates.slice(0, 2);
}
