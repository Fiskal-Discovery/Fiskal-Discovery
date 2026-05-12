// Shared Components for Fiskal Discovery
// =====================================

// Nicole Contact Card
// ===================

function renderNicoleContactCard() {
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
          Thanks for completing your Fiskal Discovery. I'll review your answers personally and be in touch within the next couple of hours. In the meantime, feel free to explore the Fiskal website or our LinkedIn page to learn more about who we are and how we can help.
        </p>
      </div>

      <div class="nicole-details">
        <h3>Nicole Bertolissi</h3>
        <p class="nicole-title">Direct Sales Executive, Fiskal</p>
        <p class="nicole-phone">07946 074 268</p>
        <p class="nicole-email">nicole@fiskal.co.uk</p>
      </div>

      <div class="nicole-card-actions">
        <a href="https://www.fiskal.online/" target="_blank" rel="noopener noreferrer" class="visit-fiskal-btn">Fiskal Website</a>
        <a href="https://www.linkedin.com/company/fiskal-ltd/?viewAsMember=true" target="_blank" rel="noopener noreferrer" class="fiskal-linkedin-btn">Fiskal LinkedIn</a>
        <a href="tel:+447946074268" class="call-now-mobile">📞 Call Nicole now</a>
      </div>
    </section>
  `;
}

function renderNicoleMessage() {
  const messageEl = document.getElementById("nicole-message");
  if (!messageEl) return;

  const nicoleMessages = [
    "Thanks for completing your Fiskal Discovery. I'll review your answers personally and be in touch within the next couple of hours. In the meantime, feel free to explore the Fiskal website or our LinkedIn page to learn more about who we are and how we can help.",
    "Thank you for sharing your details. I'll take a look through your Discovery and come back to you within the next couple of hours. While you wait, you're welcome to explore the Fiskal website or our LinkedIn page and see how we support businesses like yours.",
    "Your Discovery has been received. I'll review everything personally and will be in touch within the next couple of hours. In the meantime, feel free to visit the Fiskal website or LinkedIn page to learn more about the support available.",
    "Thanks for taking the time to complete your Discovery. I'll review your answers and contact you within the next couple of hours. While you're here, you can explore the Fiskal website or our LinkedIn page to learn more about how we can help."
  ];

  messageEl.textContent = nicoleMessages[Math.floor(Math.random() * nicoleMessages.length)];
}

function loadNicolePhoto() {
  const img = document.getElementById("nicole-photo");
  const fallback = document.querySelector(".nicole-photo-fallback");

  if (!img) {
    console.warn("Nicole photo element not found on this page");
    return;
  }

  img.onload = function () {
    img.style.display = "block";
    if (fallback) fallback.style.display = "none";
  };

  img.onerror = function () {
    img.style.display = "none";
    if (fallback) fallback.style.display = "flex";
  };

  img.src = "assets/nicole-bertolissi.jpg";
}
