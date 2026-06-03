(function() {
  function initLoader() {
    if (document.getElementById('pl-indicator')) return;

    const style = document.createElement('style');
    style.textContent = `
      #pl-indicator { position: fixed; top: 26px; left: 26px; display: flex; gap: 8px; z-index: 999999; pointer-events: none; opacity: 1; transition: opacity 0.3s ease; }
      .pl-dot { width: 10px; height: 10px; border-radius: 0%; animation: plBounce 1.2s ease-in-out infinite; }
      .pl-dot:nth-child(1) { background: #ff4d4d; }
      .pl-dot:nth-child(2) { background: #ff9f43; animation-delay: 0.15s; }
      .pl-dot:nth-child(3) { background: #2ecc71; animation-delay: 0.3s; }
      @keyframes plBounce { 0%, 100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(-8px); opacity: 0.8; } }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'pl-indicator';
    container.innerHTML = '<div class="pl-dot"></div><div class="pl-dot"></div><div class="pl-dot"></div>';
    document.body.appendChild(container);

    setTimeout(() => {
      container.style.opacity = '0';
      setTimeout(() => container.remove(), 300);
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }
})();

(function() {
  if (document.querySelector('.fixed-corner-link')) return; // prevent duplicates
  
  // --- STRIPE BACKGROUND ---
  const stripe = document.createElement('div');
  stripe.className = 'fixed-corner-stripe';
  stripe.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 35px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    pointer-events: none;
    border-radius: 48px 48px 0 0;
    transform: translateY(100%); /* Start hidden below viewport */
    opacity: 0;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
  `;
  document.body.appendChild(stripe);
  
  const link = document.createElement('a');
  link.href = 'https://akhtar.co.za/';
  link.className = 'fixed-corner-link';
  link.style.cssText = `
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%) translateY(100px); /* Start hidden + centered horizontally */
    display: block;
    z-index: 10000;
    line-height: 0;
    width: auto;
    max-width: none;
    min-width: 0;
    opacity: 0;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
  `;
  
  const img = document.createElement('img');
  img.src = 'https://akhtar.co.za/opthead.png';
  img.alt = 'akhtar.co.za';
  img.className = 'fixed-corner-img';
  img.style.cssText = `
    width: 120px;
    height: auto;
    display: block;
    border: none;
  `;
  
  link.appendChild(img);
  document.body.appendChild(link);
  
  // --- TRIGGER ANIMATION ---
  // Force reflow to ensure initial styles apply before transition
  void stripe.offsetWidth;
  void link.offsetWidth;
  
  // Animate to final position
  stripe.style.transform = 'translateY(0)';
  stripe.style.opacity = '1';
  
  link.style.transform = 'translateX(-50%) translateY(0)';
  link.style.opacity = '1';
  // --- END ANIMATION ---
})();
