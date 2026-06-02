// Fiskal Discovery — GA4 + Consent Mode v2
(function () {
  var MID  = 'G-Y5CXQKG9E0';
  var KEY  = 'fiskal_cookie_consent';
  var PP   = 'https://www.fiskal.online/privacy-policy';

  // ── 1. Consent defaults (must run before GA4 script loads) ───────────────
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    analytics_storage:      'denied',
    ad_storage:             'denied',
    functionality_storage:  'denied',
    personalization_storage:'denied',
    security_storage:       'granted',
    wait_for_update:        2000
  });

  // ── 2. Load GA4 asynchronously ────────────────────────────────────────────
  gtag('js', new Date());
  gtag('config', MID, { send_page_view: true });
  var _s = document.createElement('script');
  _s.async = true;
  _s.src   = 'https://www.googletagmanager.com/gtag/js?id=' + MID;
  document.head.appendChild(_s);

  // ── 3. Apply stored consent immediately if already granted ────────────────
  var stored = '';
  try { stored = localStorage.getItem(KEY) || ''; } catch (e) {}

  if (stored === 'accepted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  // ── 4. Show banner on first visit ─────────────────────────────────────────
  if (!stored) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', _showBanner);
    } else {
      _showBanner();
    }
  }

  // ── Banner ─────────────────────────────────────────────────────────────────
  function _showBanner() {
    if (document.getElementById('fk-cookie-banner')) return;

    var css = [
      '#fk-cookie-banner{',
        'position:fixed;bottom:0;left:0;right:0;z-index:999999;',
        'background:#15101f;',
        'border-top:2px solid #D4AF37;',
        'box-shadow:0 -4px 32px rgba(212,175,55,0.18),0 -1px 0 rgba(212,175,55,0.1);',
        'padding:16px 20px;',
        'display:flex;align-items:center;gap:16px;flex-wrap:wrap;',
        'font-family:"DM Sans",system-ui,sans-serif;',
        'font-size:13px;color:rgba(255,255,255,0.8);line-height:1.5;',
        'transform:translateY(100%);opacity:0;',
        'transition:transform 0.35s cubic-bezier(.2,.9,.3,1),opacity 0.35s ease;',
      '}',
      '#fk-cookie-banner.fk-visible{transform:translateY(0);opacity:1;}',
      '#fk-cookie-text{flex:1;min-width:200px;}',
      '#fk-cookie-text a{color:#D4AF37;text-decoration:underline;}',
      '#fk-cookie-text a:hover{color:#ffe580;}',
      '#fk-cookie-btns{display:flex;gap:8px;flex-shrink:0;}',
      '#fk-accept{',
        'background:#D4AF37;color:#0d0818;',
        'border:none;border-radius:6px;',
        'padding:9px 18px;font-size:13px;font-weight:700;',
        'cursor:pointer;letter-spacing:.03em;',
        'transition:background .2s,transform .15s;',
      '}',
      '#fk-accept:hover{background:#ffe580;transform:translateY(-1px);}',
      '#fk-decline{',
        'background:transparent;color:rgba(255,255,255,0.55);',
        'border:1px solid rgba(255,255,255,0.2);border-radius:6px;',
        'padding:9px 14px;font-size:13px;',
        'cursor:pointer;',
        'transition:border-color .2s,color .2s,transform .15s;',
      '}',
      '#fk-decline:hover{border-color:rgba(255,255,255,0.5);color:rgba(255,255,255,0.85);transform:translateY(-1px);}',
      '@media(max-width:520px){',
        '#fk-cookie-banner{flex-direction:column;align-items:stretch;padding:14px 16px;}',
        '#fk-cookie-btns{justify-content:stretch;}',
        '#fk-accept,#fk-decline{flex:1;text-align:center;}',
      '}'
    ].join('');

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'fk-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div id="fk-cookie-text">' +
        'We use analytics cookies to understand how the app is used and improve it. ' +
        'No data is collected until you accept. ' +
        '<a href="' + PP + '" target="_blank" rel="noopener noreferrer">Privacy Policy</a>' +
      '</div>' +
      '<div id="fk-cookie-btns">' +
        '<button id="fk-accept" onclick="window._fkAccept()">Accept</button>' +
        '<button id="fk-decline" onclick="window._fkDecline()">Decline</button>' +
      '</div>';

    document.body.appendChild(banner);
    // Trigger slide-in after paint
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('fk-visible');
      });
    });
  }

  function _hideBanner() {
    var b = document.getElementById('fk-cookie-banner');
    if (!b) return;
    b.classList.remove('fk-visible');
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 380);
  }

  window._fkAccept = function () {
    try { localStorage.setItem(KEY, 'accepted'); } catch (e) {}
    gtag('consent', 'update', { analytics_storage: 'granted' });
    _hideBanner();
  };

  window._fkDecline = function () {
    try { localStorage.setItem(KEY, 'declined'); } catch (e) {}
    _hideBanner();
  };
})();
