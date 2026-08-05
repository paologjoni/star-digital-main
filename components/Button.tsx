import type { ReactNode } from 'react';
import Link from 'next/link';

type Size = 'md' | 'lg';

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-4 text-base',
};

const shared =
  'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-bold transition-all duration-300';

export function GoldButton({
  href,
  children,
  size = 'md',
  ariaLabel,
  className = '',
}: {
  href: string;
  children: ReactNode;
  size?: Size;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`${shared} ${sizes[size]} group bg-gold text-bg hover:bg-gold-hi hover:shadow-[0_0_38px_-6px_rgb(245_197_24/0.65)] ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {/* Sheen sweep on hover — decorative, disabled by reduced motion. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-1/2 w-1/2 bg-white/35 opacity-0 group-hover:opacity-100 motion-safe:group-hover:animate-[sheen_0.9s_ease-out]"
      />
    </Link>
  );
}

export function OutlineButton({
  href,
  children,
  size = 'md',
  ariaLabel,
  className = '',
}: {
  href: string;
  children: ReactNode;
  size?: Size;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`${shared} ${sizes[size]} border border-white/20 bg-white/[0.03] text-ink backdrop-blur-sm hover:border-gold/60 hover:bg-gold/10 hover:text-gold ${className}`}
    >
      {children}
    </Link>
  );
}
