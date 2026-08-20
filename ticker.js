// ============================================
// Top Ticker Bar Injection
// ============================================
(function() {
  if (typeof AGENT_CONFIG === 'undefined') {
    console.warn('AGENT_CONFIG not found. Ticker bar aborted.');
    return;
  }

  const social = AGENT_CONFIG.social;
  const items = [];

  if (social.tiktok) {
    items.push(`<a href="${social.tiktok}" target="_blank" rel="noopener" class="ticker-item"><i class="fab fa-tiktok"></i> ${social.tiktokUsername}</a>`);
  }
  if (social.facebook) {
    items.push(`<a href="${social.facebook}" target="_blank" rel="noopener" class="ticker-item"><i class="fab fa-facebook-f"></i> ${social.facebookUsername}</a>`);
  }
  if (social.instagram) {
    items.push(`<a href="${social.instagram}" target="_blank" rel="noopener" class="ticker-item"><i class="fab fa-instagram"></i> ${social.instagramUsername}</a>`);
  }

  if (items.length === 0) return;

  const tickerBar = document.createElement('div');
  tickerBar.className = 'ticker-bar';
  
  const tickerTrack = document.createElement('div');
  tickerTrack.className = 'ticker-track';
  
  // Duplicate content to create a seamless infinite scroll loop
  const content = items.join('');
  tickerTrack.innerHTML = content + content; 

  tickerBar.appendChild(tickerTrack);
  
  // Inject at the very top of the body
  document.body.prepend(tickerBar);
})();