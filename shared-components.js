// Shared Components for Fiskal Discovery
// =====================================

// Nicole Contact Card
// ===================

function renderNicoleContactCard() {
  // TODO: replace '#' in Book a Call button with real booking URL (e.g. Calendly)
  return `
    <section class="nicole-contact-card" aria-label="Nicole Bertolissi contact card">
      <div class="nicole-photo-side">
        <div class="nicole-photo-wrap">
          <img id="nicole-photo" class="nicole-photo" src="assets/nicole-bertolissi.jpg" alt="Nicole Bertolissi" />
          <div class="nicole-photo-fallback">NB</div>
        </div>
      </div>

      <div class="nicole-message-wrap">
        <p class="nicole-message" id="nicole-message">
          Your Discovery has been received. I'll review everything personally and call you within the next couple of hours — or if you'd prefer to lock in a specific time, book a call below. While you wait, feel free to explore the Fiskal website or LinkedIn.
        </p>
      </div>

      <div class="nicole-details">
        <h3>Nicole Bertolissi</h3>
        <p class="nicole-title">Direct Sales Executive, Fiskal</p>
        <p class="nicole-phone">07946 074 268</p>
        <p class="nicole-email">nicole@fiskal.co.uk</p>
      </div>

      <div class="nicole-card-actions">
        <div class="nicole-buttons">
          <a href="https://calendly.com/nicole-fiskal/30min" target="_blank" rel="noopener noreferrer" class="nicole-btn nicole-btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="12" height="11" rx="1.5"/>
              <line x1="5" y1="1.5" x2="5" y2="4.5"/>
              <line x1="11" y1="1.5" x2="11" y2="4.5"/>
              <line x1="2" y1="7" x2="14" y2="7"/>
            </svg>
            Book a call
          </a>
          <a href="https://www.fiskal.online/" target="_blank" rel="noopener noreferrer" class="nicole-btn nicole-btn-secondary">Fiskal Website</a>
          <a href="https://www.linkedin.com/company/fiskal-ltd/?viewAsMember=true" target="_blank" rel="noopener noreferrer" class="nicole-btn nicole-btn-secondary">Fiskal LinkedIn</a>
        </div>
      </div>
    </section>
  `;
}

function renderNicoleMessage() {
  const messageEl = document.getElementById("nicole-message");
  if (!messageEl) return;
  // Single consistent message — update the TODO booking link above when ready
  messageEl.textContent = "Your Discovery has been received. I'll review everything personally and call you within the next couple of hours — or if you'd prefer to lock in a specific time, book a call below. While you wait, feel free to explore the Fiskal website or LinkedIn.";
}

function loadNicolePhoto() {
  const imgs = document.querySelectorAll(".nicole-photo");

  if (!imgs.length) {
    console.warn("Nicole photo element not found on this page");
    return;
  }

  imgs.forEach(function(img) {
    const wrap = img.closest(".nicole-photo-wrap");
    const fallback = wrap ? wrap.querySelector(".nicole-photo-fallback") : null;

    img.onload = function () {
      img.style.display = "block";
      if (fallback) fallback.style.display = "none";
    };

    img.onerror = function () {
      img.style.display = "none";
      if (fallback) fallback.style.display = "flex";
    };

    img.src = "assets/nicole-bertolissi.jpg";
  });
}
