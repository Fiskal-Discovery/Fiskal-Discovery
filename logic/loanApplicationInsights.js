// loanApplicationInsights.js
// Insight blocks for the Loan Application results page.
// State fields used: state.purpose, state.amount, state.security,
// state.credit, state.turnover, state.existingFacilities

function getLoanPurposeInsight(purpose, businessName) {
  const name = businessName || 'the business';
  const p = (purpose || '').toLowerCase();

  if (p.includes('working capital') || p.includes('cashflow') || p.includes('cash flow')
      || p.includes('day to day') || p.includes('wages') || p.includes('suppliers')) {
    return `Because the funding is for working capital, a loan may be one option to explore. It could give ${name} extra breathing room for day-to-day cashflow. It may also be worth looking at whether there are longer-term ways to keep cash moving more consistently rather than simply adding another repayment.`;
  }

  if (p.includes('equipment') || p.includes('machinery') || p.includes('vehicle')
      || p.includes('asset') || p.includes('plant') || p.includes('tools')) {
    return `Because the funding is linked to equipment or assets, it may be worth comparing a standard loan with Asset Finance. Asset Finance could sometimes be a better fit because the funding is directly tied to the asset itself, which may give access to more competitive terms or a better structure.`;
  }

  if (p.includes('refinanc') || p.includes('consolidat') || p.includes('existing loan')
      || p.includes('existing debt') || p.includes('existing borrowing')) {
    return `Refinancing existing debt may be worth exploring if it could simplify the monthly commitments for ${name}. Combining borrowing into one clearer repayment can sometimes make cashflow easier to manage, but the key is making sure the new structure genuinely improves the overall position.`;
  }

  if (p.includes('tax') || p.includes('hmrc') || p.includes('vat') || p.includes('corporation tax')) {
    return `If the funding is needed for a tax or HMRC bill, there are short-term funding options designed specifically for this kind of situation. It should be handled carefully so the immediate pressure is resolved without creating a repayment structure that causes further strain later.`;
  }

  if (p.includes('property') || p.includes('premises') || p.includes('commercial')
      || p.includes('office') || p.includes('warehouse') || p.includes('unit')) {
    return `Because the funding relates to property or premises, a straightforward business loan may not always be the most suitable route. A commercial mortgage can be a longer process, and if timing is important, a bridging loan may be worth considering while the longer-term structure is arranged.`;
  }

  if (p.includes('growth') || p.includes('expand') || p.includes('expansion')
      || p.includes('hire') || p.includes('staff') || p.includes('marketing')
      || p.includes('launch') || p.includes('new contract') || p.includes('investment')) {
    return `Because the funding is linked to growth or investment, a loan could give ${name} the capital injection needed to take the next step. The key is making sure the structure and repayment term fits comfortably alongside the expected return from that investment.`;
  }

  if (p.includes('stock') || p.includes('inventory') || p.includes('purchase')
      || p.includes('goods') || p.includes('trade') || p.includes('supplier')) {
    return `If the funding is for stock or trade-related purchases, it may also be worth considering whether Trade Finance could be a better fit than a standard loan, particularly if the business regularly needs to pay suppliers before customer payments come in.`;
  }

  // Generic fallback
  return `Based on what you have shared about the purpose of the funding, a business loan may be one option worth exploring. The important thing is to make sure the structure, term and monthly repayment fit comfortably with how ${name} currently operates.`;
}

function getLoanSecurityInsight(security, properties, businessName) {
  const name = businessName || 'the business';

  if (!security || security === 'None' || security === 'Unsecured') {
    return null;
  }

  if (security === 'Property' && properties && properties.length > 0) {
    return `Because ${name} has property available as security, this could open up options that may not be available on an unsecured basis. The strength of the security will depend on the equity available and any existing charges, but it is worth exploring properly.`;
  }

  if (security === 'Other assets') {
    return `Because ${name} has other assets available as security, this may improve the options available depending on the nature of those assets and their value. It is worth discussing what types of security lenders may consider.`;
  }

  return null;
}

function getExistingFacilitiesNote(existingFacilities, businessName) {
  if (!existingFacilities || existingFacilities.length === 0) return null;

  const name = businessName || 'the business';
  return `It is also worth noting that ${name} already has existing finance in place. Any new facility will need to be considered alongside the current commitments to make sure the overall position remains manageable.`;
}

function getLoanCreditConcernInsight(barrier, barrierDetails, businessName) {
  const name = businessName || 'the business';
  
  // Check if user said Yes to barriers/concerns
  if (barrier === 'yes') {
    return `You've mentioned that there may be some credit concerns, CCJs, defaults or other issues that could affect an application. It is important to be realistic — some lenders may be cautious, and not every lender will be the right fit. However, this does not automatically mean funding is not possible. Fiskal regularly comes across businesses with historic challenges, and there may still be flexible lenders prepared to look at the full picture when the funding purpose makes sense.`;
  }
  
  // Check if free text mentions credit concerns
  if (barrierDetails) {
    const text = barrierDetails.toLowerCase();
    const creditKeywords = ['ccj', 'ccjs', 'bad credit', 'poor credit', 'defaults', 'missed payments', 'arrears', 'previous decline', 'declined', 'iva', 'debt', 'hmrc arrears'];
    
    for (const keyword of creditKeywords) {
      if (text.includes(keyword)) {
        return `You've mentioned that there may be some credit concerns, CCJs, defaults or other issues that could affect an application. It is important to be realistic — some lenders may be cautious, and not every lender will be the right fit. However, this does not automatically mean funding is not possible. Fiskal regularly comes across businesses with historic challenges, and there may still be flexible lenders prepared to look at the full picture when the funding purpose makes sense.`;
      }
    }
  }
  
  return null;
}
