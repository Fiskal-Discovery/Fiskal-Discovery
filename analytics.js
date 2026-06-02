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
        'position:fixed;bottom:16px;left:50%;right:auto;',
        'transform:translateX(-50%) translateY(calc(100% + 24px));',
        'z-index:999999;',
        'background:#15101f;',
        'border:1px solid #D4AF37;',
        'border-radius:16px;',
        'box-shadow:0 8px 40px rgba(0,0,0,0.55),0 0 0 1px rgba(212,175,55,0.08);',
        'padding:20px 22px;',
        'width:min(480px,calc(100vw - 32px));',
        'box-sizing:border-box;',
        'font-family:"DM Sans",system-ui,sans-serif;',
        'font-size:13px;line-height:1.55;',
        'opacity:0;',
        'transition:transform 0.38s cubic-bezier(.2,.9,.3,1),opacity 0.38s ease;',
      '}',
      '#fk-cookie-banner.fk-visible{',
        'transform:translateX(-50%) translateY(0);',
        'opacity:1;',
      '}',
      '#fk-cookie-inner{display:flex;gap:14px;align-items:flex-start;}',
      '#fk-cookie-icon{font-size:26px;line-height:1;flex-shrink:0;margin-top:1px;}',
      '#fk-cookie-body{flex:1;min-width:0;}',
      '#fk-cookie-heading{',
        'font-size:14px;font-weight:700;',
        'color:#D4AF37;',
        'margin:0 0 5px;',
      '}',
      '#fk-cookie-copy{color:#b8a9d9;margin:0 0 14px;}',
      '#fk-cookie-copy a{color:#cc44ff;text-decoration:underline;}',
      '#fk-cookie-copy a:hover{color:#dd77ff;}',
      '#fk-cookie-btns{display:flex;gap:8px;}',
      '#fk-decline{',
        'flex:1;',
        'background:transparent;',
        'color:rgba(255,255,255,0.55);',
        'border:1px solid rgba(255,255,255,0.22);',
        'border-radius:8px;',
        'padding:9px 14px;font-size:13px;',
        'cursor:pointer;',
        'transition:border-color .2s,color .2s;',
      '}',
      '#fk-decline:hover{border-color:rgba(255,255,255,0.5);color:rgba(255,255,255,0.85);}',
      '#fk-accept{',
        'flex:1;',
        'background:#ee6a1a;color:#fff;',
        'border:none;border-radius:8px;',
        'padding:9px 18px;font-size:13px;font-weight:700;',
        'cursor:pointer;letter-spacing:.02em;',
        'transition:background .2s;',
      '}',
      '#fk-accept:hover{background:#ff7d30;}',
      '@media(max-width:520px){',
        '#fk-cookie-banner{bottom:0;border-radius:16px 16px 0 0;width:100%;border-left:none;border-right:none;border-bottom:none;}',
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
      '<div id="fk-cookie-inner">' +
        '<div id="fk-cookie-icon">🍪</div>' +
        '<div id="fk-cookie-body">' +
          '<p id="fk-cookie-heading">We use cookies — the digital kind</p>' +
          '<p id="fk-cookie-copy">' +
            'Just enough to see how our Discovery tool is performing. ' +
            'No crumbs sold to anyone. ' +
            '<a href="' + PP + '" target="_blank" rel="noopener noreferrer">Privacy Policy</a>' +
          '</p>' +
          '<div id="fk-cookie-btns">' +
            '<button id="fk-decline" onclick="window._fkDecline()">No thanks</button>' +
            '<button id="fk-accept" onclick="window._fkAccept()">Accept</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);
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
