import Reveal from './Reveal';
import Starfield from './three/Starfield';

export default function PageHero({
  badge,
  title,
  sub,
}: {
  badge?: string;
  title: string;
  sub?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-40 pb-20 text-center sm:pt-48 sm:pb-24">
      <Starfield className="absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(48rem_24rem_at_50%_0%,rgb(245_197_24/0.09),transparent_70%)]"
      />

      <div className="container-x">
        <Reveal>
          {badge && (
            <span className="inline-flex items-center rounded-full border border-gold/25 bg-gold/8 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-gold uppercase">
              {badge}
            </span>
          )}
          <h1
            className={`mx-auto max-w-4xl text-[length:var(--text-h1)] leading-[1.08] font-extrabold tracking-[-0.03em] ${
              badge ? 'mt-6' : ''
            }`}
          >
            {title}
          </h1>
          {sub && (
            <p className="mx-auto mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-muted">
              {sub}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
