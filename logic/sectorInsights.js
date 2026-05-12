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

    default:
      return null;
  }
}

// Returns a general sector note if available, for use in opening sentences.
function getSectorNote(businessName, industry) {
  const sector = detectSector(businessName, industry);
  const name = businessName || 'the business';

  const notes = {
    construction:   `${name} appears to operate in construction or a related trade`,
    recruitment:    `${name} appears to operate in recruitment or staffing`,
    transport:      `${name} appears to operate in transport, haulage or logistics`,
    healthcare:     `${name} appears to operate in healthcare, care or a related sector`,
    manufacturing:  `${name} appears to operate in manufacturing or engineering`,
    facilities:     `${name} appears to operate in facilities management, cleaning or maintenance`
  };

  return sector ? notes[sector] : null;
}
