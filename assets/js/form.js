/* Gestionnaire de formulaires côté client
   - Supporte envoi vers un endpoint tiers (Formspree, etc.) si configuré via
     window.FORM_ENDPOINTS = { contactForm: 'https://formspree.io/f/XXXXX', devisForm: 'https://formspree.io/f/YYYYY' }
   - Sinon, utilise un fallback `mailto:` ouvrant le client mail de l'utilisateur.
   Remplace les anciens traitements PHP pour permettre un site 100% statique.
*/
(function(){
  const endpoints = window.FORM_ENDPOINTS || {};

  function showMessage(form, type, text){
    let box = form.querySelector('.form-message');
    if(!box){
      box = document.createElement('div');
      box.className = 'form-message';
      form.prepend(box);
    }
    box.textContent = text;
    box.className = 'form-message ' + type;
  }

  async function handleSubmit(e){
    e.preventDefault();
    const form = e.target;
    const id = form.id;
    const data = new FormData(form);

    const endpoint = endpoints[id];
    if(endpoint){
      try{
        const res = await fetch(endpoint, { method: 'POST', body: data });
        if(res.ok){
          showMessage(form, 'success', 'Votre message a été envoyé avec succès ✅');
          form.reset();
        } else {
          showMessage(form, 'error', 'Erreur lors de l’envoi. Veuillez réessayer ❌');
        }
      }catch(err){
        showMessage(form, 'error', 'Erreur réseau. Veuillez réessayer plus tard.');
      }
      return;
    }

    // Fallback mailto: (ouvre le client mail local)
    const to = 'madiopgueye739@gmail.com';
    const subject = id === 'contactForm' ? 'Contact - InnovAfrica Tech' : 'Demande de devis - InnovAfrica Tech';
    let body = '';
    for(const [k,v] of data.entries()){
      body += `${k}: ${v}\n`;
    }
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  document.addEventListener('submit', function(e){
    if(e.target && (e.target.id === 'contactForm' || e.target.id === 'devisForm')){
      handleSubmit(e);
    }
  });
})();
