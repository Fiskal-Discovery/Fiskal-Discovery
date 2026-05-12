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

// Returns the two strongest matched product insights for a given answers object.
// Priority order follows commercial relevance and match strength.
function getTopFundingFinderInsights(answers, businessName, industry) {
  const candidates = [
    getInvoiceFinanceInsight(answers, businessName, industry),
    getTradeFinanceInsight(answers, businessName),
    getAssetFinanceInsight(answers, businessName),
    getBusinessLoanInsight(answers, businessName),
    getPropertyFinanceInsight(answers, businessName),
    getRevolvingCreditInsight(answers, businessName),
    getRDTaxCreditInsight(answers, businessName),
    getMerchantCashAdvanceInsight(answers, businessName),
    getFXInsight(answers, businessName)
  ].filter(Boolean);

  // Return top 2
  return candidates.slice(0, 2);
}
