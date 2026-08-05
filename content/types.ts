/* The shape of a language dictionary.
   Both content/sq.ts and content/en.ts must satisfy Dictionary, so the two
   languages cannot drift: adding a string to one without the other is a
   compile error. Language-independent data (URLs, hexes, image paths, tech
   tags) lives in content/shared.ts and is keyed by the same identifiers. */

export type Lang = 'sq' | 'en';

export const LANGS: Lang[] = ['sq', 'en'];

export type PortfolioKey = 'studio' | 'candles' | 'afa';
export type ServiceKey =
  | 'design'
  | 'landing'
  | 'ecom'
  | 'redesign'
  | 'maintenance'
  | 'seo';

export interface Chrome {
  skipLink: string;
  logoLabel: string;
  mainNavLabel: string;
  openMenu: string;
  closeMenu: string;
  navHome: string;
  navAbout: string;
  navServices: string;
  navContact: string;
  navCta: string;
  whatsappLabel: string;
  footerDesc: string;
  footerQuickLinks: string;
  footerFollowUs: string;
  footerCopyright: string;
  footerBuiltWith: string;
}

export interface IconCard {
  title: string;
  body: string;
}

export interface Stat {
  label: string;
  sub: string;
}

export interface PortfolioCopy {
  badge: string;
  title: string;
  desc: string;
  /** Screenshot alt text — descriptive and SEO-bearing, kept verbatim. */
  alt: string;
}

export interface HomeContent {
  badge: string;
  titleLead: string;
  titleAccent: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  wwdTitle: string;
  wwd: IconCard[];
  whyTitle: string;
  stats: Stat[];
  portfolioTitle: string;
  portfolio: Record<PortfolioKey, PortfolioCopy>;
  viewProject: string;
  bannerTitle: string;
  bannerSub: string;
  bannerCta: string;
}

export interface AboutContent {
  badge: string;
  title: string;
  whoTitle: string;
  whoBody: string;
  quote: string;
  missionTitle: string;
  missionBody: string;
  skillsTitle: string;
  reasonsTitle: string;
  reasons: string[];
}

export interface ServicesContent {
  badge: string;
  title: string;
  sub: string;
  sectionTitle: string;
  cta: string;
  /** aria-label prefix, e.g. "Kërko Ofertë: {title}" */
  ctaAriaPrefix: string;
  items: Record<ServiceKey, IconCard>;
}

export interface ContactContent {
  title: string;
  sub: string;
  labelName: string;
  labelEmail: string;
  labelPhone: string;
  labelBusiness: string;
  labelProjectType: string;
  labelBudget: string;
  labelMessage: string;
  placeholderName: string;
  placeholderEmail: string;
  placeholderPhone: string;
  placeholderBusiness: string;
  placeholderMessage: string;
  selectProject: string;
  selectBudget: string;
  projectTypes: string[];
  budgetRanges: string[];
  submitButton: string;
  sending: string;
  successMsg: string;
  errorMsg: string;
  responseNote: string;
  reachDirectly: string;
  actionWhatsapp: string;
  actionEmail: string;
  actionInstagram: string;
}

export interface PageMeta {
  title: string;
  description: string;
}

export interface Dictionary {
  chrome: Chrome;
  home: HomeContent;
  about: AboutContent;
  services: ServicesContent;
  contact: ContactContent;
  meta: {
    home: PageMeta;
    about: PageMeta;
    services: PageMeta;
    contact: PageMeta;
  };
  /** Organization-level strings that appear inside structured data. */
  org: {
    description: string;
    slogan: string;
    offerCatalogName: string;
    portfolioListName: string;
    breadcrumbHome: string;
  };
}
