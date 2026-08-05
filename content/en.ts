/* English copy — transcribed verbatim from the pre-rebuild en/ pages and
   js/i18n.js. Do not reword. scripts/parity-check.mjs diffs this against
   the originals. */

import type { Dictionary } from './types';

export const en: Dictionary = {
  chrome: {
    skipLink: 'Skip to content',
    logoLabel: 'Star Digital',
    mainNavLabel: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    navHome: 'Home',
    navAbout: 'About',
    navServices: 'Services',
    navContact: 'Contact',
    navCta: 'Get a Quote',
    whatsappLabel: 'Chat with us on WhatsApp',
    footerDesc:
      'Premium web design & development for Albanian businesses ready to grow online.',
    footerQuickLinks: 'Quick Links',
    footerFollowUs: 'Follow Us',
    footerCopyright: '© 2025 Star Digital. All rights reserved.',
    footerBuiltWith: 'Built with passion in Albania 🇦🇱',
  },

  home: {
    badge: 'Star Digital',
    titleLead: 'We Build Websites in Albania That ',
    titleAccent: 'Work.',
    sub: 'Star Digital crafts fast, modern, and beautiful websites for Albanian businesses ready to grow online.',
    ctaPrimary: 'Start Your Project',
    ctaSecondary: 'See Our Work',

    wwdTitle: 'What We Do',
    wwd: [
      {
        title: 'Web Design',
        body: 'Pixel-perfect designs that look stunning on every screen and leave a lasting first impression.',
      },
      {
        title: 'Web Development',
        body: 'Clean, fast, and scalable code built with the latest technologies. No templates, everything custom.',
      },
      {
        title: 'Custom Solutions',
        body: 'From landing pages to full web applications, we build whatever your business needs.',
      },
    ],

    whyTitle: 'Why Star Digital?',
    stats: [
      { label: '100% Custom', sub: 'No templates, ever.' },
      { label: 'Mobile First', sub: 'Every site works perfectly on phones.' },
      { label: 'Fast Delivery', sub: 'Most projects done in 1–3 weeks.' },
      { label: 'Direct Communication', sub: 'You talk straight to the developer.' },
    ],

    portfolioTitle: 'Our Work',
    portfolio: {
      studio: {
        badge: 'Clinic Website',
        title: 'Dr. Pashk Gjoni Orthopedic Studio',
        desc: 'A bilingual website for an orthopedic clinic in Lezhë. Services, clinic info, and patient contact.',
        alt: 'Bilingual clinic website for Dr. Pashk Gjoni Orthopedic Studio in Lezhë, built by Star Digital',
      },
      candles: {
        badge: 'Product Website',
        title: 'Candles Auroma',
        desc: 'An elegant website for a handmade candle brand in Lezhë. Product catalog, gallery, and direct ordering through Instagram.',
        alt: 'Product catalogue website for handmade candle brand Candles Auroma, built by Star Digital',
      },
      afa: {
        badge: 'Corporate Website',
        title: 'AFA Engineering Klima',
        desc: 'A professional website for an HVAC contractor in Tirana. Services, completed projects, and fast contact for quotes.',
        alt: 'Corporate website for AFA Engineering Klima, an HVAC contractor in Tirana, built by Star Digital',
      },
    },
    viewProject: 'View Project',

    bannerTitle: 'Ready to Take Your Business Online?',
    bannerSub: "Let's talk. No commitment. Just a conversation about what you need.",
    bannerCta: 'Get in Touch',
  },

  about: {
    badge: 'Star Digital',
    title: 'About Us — Web Design Agency in Albania',
    whoTitle: 'Who We Are',
    whoBody:
      'Star Digital was born from a simple belief: every Albanian business deserves a world-class online presence. Founded by a passionate young developer, we bring big-agency quality with small-team personal attention. We care about your business as much as you do.',
    quote:
      'Our mission is to help Albanian businesses compete online. Not just locally, but globally. We build websites that generate real results — more customers, more trust, more growth.',
    missionTitle: 'Our Mission',
    missionBody:
      'Our mission is to help Albanian businesses compete online. Not just locally, but globally. We build websites that generate real results — more customers, more trust, more growth.',
    skillsTitle: 'Skills & Stack',
    reasonsTitle: 'Why Work With Us',
    reasons: [
      'Personal attention on every project — you are never just a ticket.',
      'Fast turnaround — no waiting weeks to see results.',
      'No middlemen — you talk directly to the developer.',
      'We care about your results, not just delivery.',
    ],
  },

  services: {
    badge: 'Services',
    title: 'Everything You Need to Dominate Online',
    sub: 'From a simple landing page to a complex web application, we build it all with the same standard: fast, clean, and conversion-focused.',
    sectionTitle: 'Our Services',
    cta: 'Get a Quote',
    ctaAriaPrefix: 'Get a Quote',
    items: {
      design: {
        title: 'Website Design & Development',
        body: 'Custom websites built from scratch. Mobile-first, fast, modern, and built to convert visitors into customers.',
      },
      landing: {
        title: 'Landing Pages',
        body: 'High-converting single-page sites for campaigns, product launches, or business promotions.',
      },
      ecom: {
        title: 'E-commerce Websites',
        body: 'Online stores with product pages, cart, and payment integration. Sell online with confidence.',
      },
      redesign: {
        title: 'Website Redesign',
        body: 'Outdated site dragging you down? We rebuild it from scratch with modern design, faster load times, and a layout built to convert.',
      },
      maintenance: {
        title: 'Website Maintenance',
        body: 'Ongoing support, updates, security patches, and performance monitoring so you never worry.',
      },
      seo: {
        title: 'SEO Optimization',
        body: 'On-page SEO so your business actually gets found on Google. Local and international reach.',
      },
    },
  },

  contact: {
    title: 'Contact — Free Quote for Your Website',
    sub: "Tell us about your project and we'll get back to you within 24 hours.",
    labelName: 'Full Name',
    labelEmail: 'Email Address',
    labelPhone: 'Phone Number (optional)',
    labelBusiness: 'Business Name (optional)',
    labelProjectType: 'Project Type',
    labelBudget: 'Budget Range',
    labelMessage: 'Message',
    placeholderName: 'John Doe',
    placeholderEmail: 'john@example.com',
    placeholderPhone: '+355 69 000 0000',
    placeholderBusiness: 'My Business',
    placeholderMessage: 'Tell us about your project...',
    selectProject: 'Select project type',
    selectBudget: 'Select budget range',
    projectTypes: [
      'Web Design & Development',
      'Landing Pages',
      'Ecom Store',
      'Website Redesign',
      'Website Maintenance',
    ],
    budgetRanges: ['Under €500', '€500–€1,500', '€1,500–€5,000', '€5,000+', 'Not sure'],
    submitButton: 'Send Message',
    sending: 'Sending...',
    successMsg: "Thanks! We'll get back to you within 24 hours.",
    errorMsg: 'Something went wrong. Please try again or reach us on WhatsApp.',
    responseNote: 'We typically respond within 24 hours.',
    reachDirectly: 'Or reach us directly',
    actionWhatsapp: 'Chat on WhatsApp',
    actionEmail: 'Send an Email',
    actionInstagram: '@stardigital.app',
  },

  meta: {
    home: {
      title: 'Star Digital — Web Design & Development Agency in Albania',
      description:
        'We build fast, modern, responsive websites for Albanian businesses. Web design, development, e-commerce and SEO. Free quote within 24 hours.',
    },
    about: {
      title: 'About Us — Albanian Web Development Agency | Star Digital',
      description:
        'Star Digital is an Albanian web design and development agency. Learn about our mission to help Albanian businesses compete and grow online.',
    },
    services: {
      title: 'Services — Web Design, E-commerce & SEO | Star Digital',
      description:
        'Custom website design and development, landing pages, e-commerce stores, redesigns, maintenance and SEO optimization for Albanian businesses.',
    },
    contact: {
      title: 'Contact — Get a Free Quote | Star Digital',
      description:
        'Get in touch with Star Digital about your website project. Free quote, no commitment. We reply within 24 hours on WhatsApp or email.',
    },
  },

  org: {
    description:
      'We build fast, modern, responsive websites for Albanian businesses. Web design, development, e-commerce and SEO. Free quote within 24 hours.',
    slogan: 'We build websites that work.',
    offerCatalogName: 'Services',
    portfolioListName: 'Our Work',
    breadcrumbHome: 'Home',
  },
};
