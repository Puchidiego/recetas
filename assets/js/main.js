// Recetario Saludable — interacciones de la landing

// Datos de la Storefront API de Shopify (mismos que genera el canal "Buy Button")
const SHOPIFY_STORE = {
  domain: 'sptts0-38.myshopify.com',
  storefrontAccessToken: '5c8483eb071ba5b33197ead5ffc7f228',
  apiVersion: '2025-04',
  variantId: 'gid://shopify/ProductVariant/42752491126869',
};

// Crea un checkout nuevo en Shopify y redirige ahí (mismo comportamiento que
// el botón "Buy now" -> "checkout" del canal Buy Button, con nuestro propio diseño).
async function redirectToCheckout(triggerEl) {
  const originalLabel = triggerEl.textContent;
  triggerEl.setAttribute('aria-busy', 'true');
  triggerEl.textContent = 'Redirigiendo…';

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE.domain}/api/${SHOPIFY_STORE.apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STORE.storefrontAccessToken,
        },
        body: JSON.stringify({
          query: `mutation { cartCreate(input: { lines: [{ merchandiseId: "${SHOPIFY_STORE.variantId}", quantity: 1 }] }) { cart { checkoutUrl } userErrors { message } } }`,
        }),
      }
    );
    const json = await response.json();
    const checkoutUrl = json?.data?.cartCreate?.cart?.checkoutUrl;

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      return;
    }
  } catch (error) {
    // sigue al fallback de abajo
  }

  // Fallback si la API falla: manda a la página del producto
  triggerEl.textContent = originalLabel;
  triggerEl.removeAttribute('aria-busy');
  window.location.href = triggerEl.getAttribute('href') || 'https://bibliodecontenido.com/productos/recetas-sanas';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-buy]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      redirectToCheckout(el);
    });
  });

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
