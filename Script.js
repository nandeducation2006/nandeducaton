// Mobile nav toggle and configurable form handler (all text in English)

// FORM_ENDPOINT will be populated from `config.json` if present in the site root.
// To enable real submissions, copy `config.example.json` → `config.json` and set `formEndpoint`.
let FORM_ENDPOINT = '';
fetch('config.json').then(res => {
  if (!res.ok) throw new Error('no config');
  return res.json();
}).then(cfg => {
  if (cfg && cfg.formEndpoint) FORM_ENDPOINT = cfg.formEndpoint;
}).catch(() => {
  // silence: missing config.json means demo mode
  console.info('No config.json found — contact form will use demo behavior.');
});

document.addEventListener('DOMContentLoaded', function () {
  // Nav toggle
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('open');
    });
  }

  // Contact form handler
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const message = form.message.value.trim();

      // Simple front-end validation
      if (!name || !phone) {
        formMessage.style.color = 'crimson';
        formMessage.textContent = 'Please provide your name and phone number.';
        return;
      }

      // If a FORM_ENDPOINT is configured, POST to it. Otherwise, keep demo behaviour.
      if (FORM_ENDPOINT) {
        formMessage.style.color = 'initial';
        formMessage.textContent = 'Sending...';

        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, message })
        }).then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json().catch(() => ({}));
        }).then(data => {
          formMessage.style.color = 'green';
          formMessage.textContent = data.message || 'Request sent successfully.';
          form.reset();
        }).catch(err => {
          console.error('Form submission failed', err);
          formMessage.style.color = 'crimson';
          formMessage.textContent = 'Submission failed. Please try again later.';
        });
      } else {
        // Demo success (no backend configured)
        formMessage.style.color = 'green';
        formMessage.textContent = 'Thank you! Your request has been received. We will call you soon.';
        form.reset();
      }
    });
  }
});