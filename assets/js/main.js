// Recetario Saludable — interacciones de la landing

document.addEventListener('DOMContentLoaded', () => {
  // Menú móvil
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Barra de compra fija (aparece luego del hero, se oculta cerca del footer)
  const stickyCta = document.getElementById('stickyCta');
  const hero = document.querySelector('.hero');
  const productSection = document.getElementById('producto');

  if (stickyCta && hero && productSection) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        stickyCta.classList.toggle('visible', !entry.isIntersecting);
      },
      { rootMargin: '-10% 0px 0px 0px' }
    );
    heroObserver.observe(hero);

    const productObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) stickyCta.classList.remove('visible');
      },
      { threshold: 0.3 }
    );
    productObserver.observe(productSection);
  }

  // Suscripción por email (demo local, sin backend)
  const subscribeForm = document.getElementById('subscribeForm');
  const subscribeMsg = document.getElementById('subscribeMsg');

  if (subscribeForm && subscribeMsg) {
    subscribeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      subscribeMsg.textContent = '¡Listo! Revisá tu correo, te vamos a escribir pronto 🥗';
      subscribeForm.reset();
    });
  }
});
