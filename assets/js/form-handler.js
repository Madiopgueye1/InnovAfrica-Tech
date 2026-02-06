document.addEventListener('DOMContentLoaded', function () {
  function showMessage(container, text, isError) {
    container.textContent = text;
    container.classList.toggle('error', !!isError);
    container.classList.toggle('success', !isError);
  }

  function buildMailto(to, subject, body) {
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handleForm(form, type) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const data = new FormData(form);
      const values = {};
      for (const [k, v] of data.entries()) values[k] = v;

      // basic validation
      for (const [k, v] of Object.entries(values)) {
        if (!v || String(v).trim() === '') {
          const msgElem = document.getElementById(type === 'contact' ? 'contactMessage' : 'devisMessage');
          showMessage(msgElem, 'Veuillez remplir tous les champs requis.', true);
          if (submitBtn) submitBtn.disabled = false;
          return;
        }
      }

      // prepare email
      const to = 'madiopgueye739@gmail.com';
      let subject = '';
      let body = '';

      if (type === 'contact') {
        subject = `Nouveau message de contact - ${values.nom || 'Contact'}`;
        body += `Nom: ${values.nom || ''}\n`;
        body += `Email: ${values.email || ''}\n`;
        body += `Téléphone: ${values.tel || ''}\n\n`;
        body += `Message:\n${values.message || ''}`;
      } else {
        subject = `Demande de devis - ${values.service || ''}`;
        body += `Service demandé: ${values.service || ''}\n`;
        body += `Budget estimé: ${values.budget || ''} FCFA\n`;
        body += `Délai souhaité: ${values.delai || ''}`;
      }

      const mailto = buildMailto(to, subject, body);

      // Try to open user's mail client (mailto). This is the simplest static fallback.
      try {
        window.location.href = mailto;
        const msgElem = document.getElementById(type === 'contact' ? 'contactMessage' : 'devisMessage');
        showMessage(msgElem, 'Un email a été préparé dans votre client de messagerie. Veuillez l’envoyer pour compléter.', false);
      } catch (err) {
        const msgElem = document.getElementById(type === 'contact' ? 'contactMessage' : 'devisMessage');
        showMessage(msgElem, 'Impossible d’ouvrir le client de messagerie. Copiez les informations et contactez-nous manuellement.', true);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) handleForm(contactForm, 'contact');

  const devisForm = document.getElementById('devisForm');
  if (devisForm) handleForm(devisForm, 'devis');
});
document.addEventListener('DOMContentLoaded', function () {
  const ENDPOINTS = {
    contact: 'https://formspree.io/f/yourContactFormId', // Remplacez par votre Formspree ID
    devis: 'https://formspree.io/f/yourDevisFormId' // Remplacez par votre Formspree ID
  };

  function showMessage(el, text, ok = true) {
    el.textContent = text;
    el.classList.toggle('success', ok);
    el.classList.toggle('error', !ok);
  }

  async function submitToEndpoint(endpoint, formData) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });
    return res;
  }

  function mailtoFallback(email, subject, body) {
    const uri = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = uri;
  }

  function bindForm(id, endpointKey, messageId) {
    const form = document.getElementById(id);
    const msgEl = document.getElementById(messageId);
    if (!form || !msgEl) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      showMessage(msgEl, 'Envoi en cours...', true);

      const endpoint = ENDPOINTS[endpointKey];
      const formData = new FormData(form);

      // Si l'utilisateur n'a pas remplacé l'endpoint, faire fallback mailto
      if (!endpoint || endpoint.includes('your')) {
        // construire un email simple
        const subject = endpointKey === 'contact' ? 'Message de contact' : 'Demande de devis';
        let body = '';
        for (const pair of formData.entries()) {
          body += `${pair[0]}: ${pair[1]}\n`;
        }
        showMessage(msgEl, 'Aucun endpoint configuré. Ouverture du client mail...', true);
        // Remplacez l'email ci-dessous si besoin
        mailtoFallback('madiopgueye739@gmail.com', subject, body);
        return;
      }

      try {
        const res = await submitToEndpoint(endpoint, formData);
        if (res.ok) {
          showMessage(msgEl, 'Message envoyé avec succès ✅', true);
          form.reset();
        } else {
          showMessage(msgEl, 'Erreur lors de l’envoi. Essayez via votre client mail.', false);
        }
      } catch (err) {
        showMessage(msgEl, 'Erreur réseau. Essayez via votre client mail.', false);
      }
    });
  }

  bindForm('contactForm', 'contact', 'contactMessage');
  bindForm('devisForm', 'devis', 'devisMessage');
});
