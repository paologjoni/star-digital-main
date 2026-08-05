import { CONTACT, getDictionary, type Lang } from '@/content';
import { WhatsAppIcon } from './icons';

export default function WhatsAppButton({ lang }: { lang: Lang }) {
  const label = getDictionary(lang).chrome.whatsappLabel;

  return (
    <a
      href={CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_10px_34px_-8px_rgb(37_211_102/0.75)] transition-transform duration-300 hover:scale-110 motion-safe:animate-[wa-float_5s_ease-in-out_infinite]"
    >
      <WhatsAppIcon className="h-7 w-7" strokeWidth={2.5} />
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-lg bg-surface px-3 py-2 text-xs font-medium whitespace-nowrap text-ink opacity-0 shadow-lift transition-opacity duration-300 group-hover:opacity-100 lg:block">
        {label}
      </span>
    </a>
  );
}
