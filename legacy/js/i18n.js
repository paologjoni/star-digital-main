/* Runtime strings only.
   All page copy is now static HTML — Albanian at /, English at /en/ — so
   search engines get real text without executing any JavaScript. What is
   left here is the handful of strings that genuinely only exist at runtime:
   the contact form's <select> options and its submit/success/error states.

   The active language comes from <html lang>, which the served page already
   declares. That makes the URL the single source of truth: no localStorage,
   no flash of the wrong language, and no way for the markup and the script
   to disagree. */

const LANG = document.documentElement.lang === 'en' ? 'en' : 'sq';

const STRINGS = {
  sq: {
    contact: {
      sending: 'Duke dërguar...',
      submitButton: 'Dërgo Mesazhin',
      successMsg: 'Faleminderit! Do t\'ju kthejmë përgjigje brenda 24 orësh.',
      errorMsg: 'Diçka shkoi keq. Ju lutemi provoni përsëri ose na kontaktoni në WhatsApp.',
      projectTypes: ['Dizajn & Zhvillim Faqesh', 'Landing Pages', 'Dyqane Online', 'Rikonstruktim Faqeje', 'Mirëmbajtje Faqeje'],
      budgetRanges: ['Nën €500', '€500–€1,500', '€1,500–€5,000', '€5,000+', 'Nuk e di'],
      selectProject: 'Zgjidhni llojin e projektit',
      selectBudget: 'Zgjidhni buxhetin'
    }
  },
  en: {
    contact: {
      sending: 'Sending...',
      submitButton: 'Send Message',
      successMsg: 'Thanks! We\'ll get back to you within 24 hours.',
      errorMsg: 'Something went wrong. Please try again or reach us on WhatsApp.',
      projectTypes: ['Web Design & Development', 'Landing Pages', 'Ecom Store', 'Website Redesign', 'Website Maintenance'],
      budgetRanges: ['Under €500', '€500–€1,500', '€1,500–€5,000', '€5,000+', 'Not sure'],
      selectProject: 'Select project type',
      selectBudget: 'Select budget range'
    }
  }
};

function t(key) {
  let val = STRINGS[LANG];
  for (const p of key.split('.')) val = val?.[p];
  return val ?? key;
}

function populateSelect(id, options, placeholder) {
  const sel = document.getElementById(id);
  if (!sel || !Array.isArray(options)) return;
  const current = sel.value;
  sel.innerHTML = '';

  const ph = document.createElement('option');
  ph.value = '';
  ph.disabled = true;
  ph.textContent = placeholder;
  sel.appendChild(ph);

  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    if (opt === current) o.selected = true;
    sel.appendChild(o);
  });

  if (!current) sel.value = '';
}

populateSelect('select-project-type', t('contact.projectTypes'), t('contact.selectProject'));
populateSelect('select-budget', t('contact.budgetRanges'), t('contact.selectBudget'));
