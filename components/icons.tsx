/* Line icons carried over from the pre-rebuild markup, unchanged in shape.
   All are decorative: the surrounding element supplies the accessible name. */

type IconProps = { className?: string; strokeWidth?: number };

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
};

export const MenuIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2} className={className}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2} className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const ChevronDown = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2} className={className}>
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

export const ChevronRight = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2} className={className}>
    <polyline points="9,6 15,12 9,18" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2.5} className={className}>
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

export const WhatsAppIcon = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg {...base} strokeWidth={strokeWidth} className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const MailIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2} className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const InstagramIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const ClockIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2} className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

export const SuccessIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2} className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

export const AlertIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2} className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ── Service icons, in the order the services grid renders them ───────── */

export const MonitorIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.5} className={className}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export const LayersIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.5} className={className}>
    <polygon points="12,2 2,7 12,12 22,7 12,2" />
    <polyline points="2,17 12,22 22,17" />
    <polyline points="2,12 12,17 22,12" />
  </svg>
);

export const CartIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.5} className={className}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export const CodeIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.5} className={className}>
    <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />
  </svg>
);

export const WrenchIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.5} className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export const SearchIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.5} className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
