document.addEventListener('DOMContentLoaded', () => {
  // Navbar burger toggle
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => navLinks.classList.toggle('show'));
  }

  // Simple field validation visual helper
  function touchValidation(form) {
    if (!form) return;
    form.querySelectorAll('input,textarea,select').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value && field.value.trim() !== '') {
          field.style.borderColor = '';
        }
      });
    });
  }

  touchValidation(document.getElementById('contactForm'));
  touchValidation(document.getElementById('devisForm'));

  // Intersection animations for cards/sections
  const animateTargets = document.querySelectorAll('.service-card, .project-card, .blog-post, .team-member, .home-services, .home-projects, .home-blog, .cta');
  if (animateTargets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {threshold: 0.16});

    animateTargets.forEach(el => {
      el.classList.add('pre-animate');
      io.observe(el);
    });
  }
  
  // Hero stagger reveal
  const heroTitle = document.querySelector('.hero h1');
  const heroText = document.querySelector('.hero p');
  const heroBtn = document.querySelector('.hero .btn');
  if (heroTitle) setTimeout(()=> heroTitle.classList.add('in-view'), 220);
  if (heroText) setTimeout(()=> heroText.classList.add('in-view'), 420);
  if (heroBtn) setTimeout(()=> heroBtn.classList.add('in-view'), 640);
});

