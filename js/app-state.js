// ============================================================
// DEVELOPMENT MODE
// ============================================================
var DEV_MODE = false;
var SEND_EMAILS = false;

// ============================================================
// APP STATE
// ============================================================
var appState = {
  profile: {
    userType: null,
    name: null,
    email: null,
    phone: null,
    companyName: null,
    hasCompanyNumber: null,
    companyNumber: null,
    industry: null,
    annualTurnover: null,
    fundingAmount: null
  },
  fundingFinder: {},
  facilityReview: {},
  loanApp: {},
  currentModule: null
};

// ============================================================
// APP STATE MANAGEMENT
// ============================================================
function loadAppState() {
  try {
    var saved = localStorage.getItem('fiskal_appState');
    if (saved) {
      var parsed = JSON.parse(saved);
      Object.assign(appState, parsed);
    }
  } catch (e) {
    console.warn('Failed to load appState:', e);
  }
}

function saveAppState() {
  try {
    localStorage.setItem('fiskal_appState', JSON.stringify(appState));
    // Also sync profile to fiskal_profile so shariah-funding and cashflow-invaders can read it
    if (appState.profile) {
      localStorage.setItem('fiskal_profile', JSON.stringify(appState.profile));
    }
  } catch (e) {
    console.warn('Failed to save appState:', e);
  }
}

// Load app state on page load
loadAppState();
