// sectorInsights.js
// Detects business sector from business name or industry field
// and returns optional contextual insight blocks.

const SECTOR_PATTERNS = [
  {
    sector: 'construction',
    keywords: ['construction', 'build', 'builder', 'builders', 'contractor', 'contractors',
               'civils', 'groundwork', 'groundworks', 'electrical', 'mechanical',
               'plumbing', 'plumber', 'roofing', 'roofer', 'scaffolding', 'demolition',
               'fit out', 'fitout', 'refurb', 'refurbishment', 'surveying', 'surveyor',
               'joinery', 'brickwork', 'insulation', 'drainage', 'excavation']
  },
  {
    sector: 'recruitment',
    keywords: ['recruitment', 'recruiter', 'staffing', 'temps', 'temporary', 'workforce',
               'personnel', 'labour', 'labor', 'talent', 'headhunting', 'hr solutions',
               'payroll services', 'agency workers']
  },
  {
    sector: 'transport',
    keywords: ['transport', 'haulage', 'logistics', 'freight', 'courier', 'delivery',
               'trucking', 'distribution', 'fleet', 'removal', 'removals', 'van hire',
               'shipping', 'forwarding', 'road haulage', 'warehousing', 'storage']
  },
  {
    sector: 'healthcare',
    keywords: ['care', 'healthcare', 'health care', 'nursing', 'medical', 'clinic',
               'dental', 'dentist', 'domiciliary', 'pharmacy', 'pharmacist', 'therapy',
               'therapist', 'physio', 'physiotherapy', 'optician', 'gp', 'nhs',
               'care home', 'supported living', 'residential care', 'ambulance']
  },
  {
    sector: 'manufacturing',
    keywords: ['manufacturing', 'manufacturer', 'engineering', 'engineer', 'fabrication',
               'fabricator', 'precision', 'production', 'industrial', 'assembly',
               'machining', 'tooling', 'casting', 'welding', 'forging', 'plastics',
               'packaging', 'processing']
  },
  {
    sector: 'facilities',
    keywords: ['cleaning', 'facilities', 'security', 'maintenance', 'fm', 'hygiene',
               'janitorial', 'grounds maintenance', 'pest control', 'waste management',
               'property maintenance', 'building services', 'window cleaning']
  },
  {
    sector: 'wholesale',
    keywords: ['wholesale', 'wholesaler', 'distributor', 'distribution', 'importer',
               'import', 'exporter', 'export', 'trade supplier', 'merchant']
  },
  {
    sector: 'retail',
    keywords: ['retail', 'retailer', 'shop', 'store', 'ecommerce', 'e-commerce',
               'online store', 'marketplace', 'merchant', 'boutique']
  },
  {
    sector: 'clean-energy',
    keywords: ['clean energy', 'renewable', 'solar', 'wind energy', 'ev charging',
               'electric vehicle', 'battery storage', 'green energy', 'net zero',
               'sustainability', 'hydrogen', 'biomass']
  },
  {
    sector: 'professional-services',
    keywords: ['accountant', 'accountancy', 'solicitor', 'legal', 'law firm',
               'consultant', 'consultancy', 'architect', 'surveyor', 'marketing agency',
               'agency', 'pr firm', 'management consulting', 'advisory', 'financial services']
  }
];

function detectSector(businessName, industry) {
  const text = ((businessName || '') + ' ' + (industry || '')).toLowerCase();
  for (const pattern of SECTOR_PATTERNS) {
    if (pattern.keywords.some(kw => text.includes(kw))) {
      return pattern.sector;
    }
  }
  return null;
}

// Returns a sector-specific Invoice Finance insight, or null if not applicable.
function getSectorInvoiceFinanceInsight(businessName, industry) {
  const sector = detectSector(businessName, industry);
  const name = businessName || 'the business';

  switch (sector) {
    case 'construction':
      return `Invoice Finance may be worth exploring, especially if ${name} waits for customers or contractors to pay invoices. For construction-related businesses, it may be worth looking at specialist facilities that can support contractual invoices, applications for payment or staged payments, where standard invoice finance may not always fit neatly.`;

    case 'recruitment':
      return `As ${name} appears to operate in recruitment or staffing, specialist recruitment finance may be worth exploring. This can help fund payroll before clients pay their invoices, and some providers may also offer optional back-office or payroll support.`;

    case 'transport':
      return `As ${name} appears to operate in transport, haulage or logistics, Invoice Finance may be especially relevant. It is very common in this sector because businesses often have to pay drivers, fuel, subcontractors and running costs before customers settle their invoices.`;

    case 'healthcare':
      return `As ${name} appears to operate in healthcare, care or a related sector, cashflow timing can be particularly important. If invoices are raised to local authorities, agencies, insurers or commercial clients, Invoice Finance may help release cash sooner while waiting for those payments.`;

    case 'manufacturing':
      return `As ${name} appears to operate in manufacturing or engineering, cashflow timing can be important when raw material costs and production run ahead of customer payments. Invoice Finance can help smooth that gap.`;

    case 'wholesale':
      return `As ${name} appears to operate in wholesale or distribution, Trade Finance may be especially relevant — it allows you to pay suppliers upfront (securing better terms or pricing) without tying up working capital, while Invoice Finance can release cash from outstanding invoices.`;

    case 'retail':
      return `As ${name} appears to operate in retail, stock finance or a revolving credit facility may be worth exploring — both can help fund inventory without locking up working capital. If card payments are taken regularly, a Merchant Cash Advance may also be an option.`;

    case 'clean-energy':
      return `As ${name} operates in the clean energy or renewable sector, asset finance is often a good fit — it allows equipment, installations or infrastructure to be acquired without large upfront capital outlay while the asset generates returns over time.`;

    case 'professional-services':
      return `As ${name} operates in professional services, cashflow can be impacted by delayed client payments. Invoice Finance may help release funds tied up in outstanding invoices, while a revolving credit facility can provide a flexible buffer for periods between projects or retainers.`;

    default:
      return null;
  }
}

// Returns a general sector note if available, for use in opening sentences.
function getSectorNote(businessName, industry) {
  const sector = detectSector(businessName, industry);
  const name = businessName || 'the business';

  const notes = {
    construction:          `${name} appears to operate in construction or a related trade`,
    recruitment:           `${name} appears to operate in recruitment or staffing`,
    transport:             `${name} appears to operate in transport, haulage or logistics`,
    healthcare:            `${name} appears to operate in healthcare, care or a related sector`,
    manufacturing:         `${name} appears to operate in manufacturing or engineering`,
    facilities:            `${name} appears to operate in facilities management, cleaning or maintenance`,
    wholesale:             `${name} appears to operate in wholesale or distribution`,
    retail:                `${name} appears to operate in retail`,
    'clean-energy':        `${name} operates in clean energy or renewables`,
    'professional-services': `${name} operates in professional services`
  };

  return sector ? notes[sector] : null;
}
