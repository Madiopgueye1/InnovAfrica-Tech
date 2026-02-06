/* UI interactions: back-to-top, smooth scroll, reveal stagger */
document.addEventListener('DOMContentLoaded', () => {
  // Back to top
  const btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.title = 'Remonter en haut';
  btt.innerHTML = '↑';
  document.body.appendChild(btt);

  function checkScroll() {
    if (window.scrollY > 300) btt.classList.add('show'); else btt.classList.remove('show');
  }
  window.addEventListener('scroll', checkScroll, {passive:true});
  checkScroll();

  btt.addEventListener('click', () => {
    window.scrollTo({top:0,behavior:'smooth'});
  });

  // Smooth anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Stagger children animation for grids
  document.querySelectorAll('.projects-grid, .services-grid, .blog-grid, .team-grid').forEach(grid => {
    const items = Array.from(grid.children);
    items.forEach((it, i) => {
      it.style.transitionDelay = `${i * 80}ms`;
      it.classList.add('pre-animate');
    });
  });

  // Newsletter form subscription
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const button = newsletterForm.querySelector('button');
      const email = emailInput.value.trim();
      
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
      }

      // Simulate subscription (in production, this would send to a server)
      const originalText = button.textContent;
      button.textContent = 'Abonnement confirmé ✓';
      button.style.opacity = '0.8';
      button.disabled = true;
      emailInput.value = '';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.opacity = '1';
        button.disabled = false;
      }, 3000);
      
      alert('Merci pour votre abonnement ! Un email de confirmation a été envoyé.');
    });
  }
