'use client';

import { useState } from 'react';

import { CONTACT, getDictionary, type Lang } from '@/content';
import { AlertIcon, SuccessIcon } from './icons';

/* Same Formspree endpoint and same payload shape as the pre-rebuild site.
   No backend, so the whole site stays statically rendered. */

type Status = 'idle' | 'sending' | 'sent' | 'error';

const fieldClass =
  'w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink transition-colors placeholder:text-muted/55 focus:border-gold/60 focus:bg-bg/80 focus:outline-none';

export default function ContactForm({ lang }: { lang: Lang }) {
  const t = getDictionary(lang).contact;
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(CONTACT.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('server error');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-start gap-4 rounded-2xl border border-gold/30 bg-gold/8 p-7"
      >
        <SuccessIcon className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
        <p className="text-sm leading-relaxed">{t.successMsg}</p>
      </div>
    );
  }

  return (
    <div className="rim relative overflow-hidden rounded-3xl glass p-7 sm:p-9">
      {status === 'error' && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4"
        >
          <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
          <span className="text-sm text-red-100">{t.errorMsg}</span>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate={false}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="eyebrow mb-2 block" htmlFor="field-name">
              {t.labelName}
            </label>
            <input
              id="field-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder={t.placeholderName}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="eyebrow mb-2 block" htmlFor="field-email">
              {t.labelEmail}
            </label>
            <input
              id="field-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={t.placeholderEmail}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="eyebrow mb-2 block" htmlFor="field-phone">
              {t.labelPhone}
            </label>
            <input
              id="field-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder={t.placeholderPhone}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="eyebrow mb-2 block" htmlFor="field-business">
              {t.labelBusiness}
            </label>
            <input
              id="field-business"
              name="business"
              type="text"
              autoComplete="organization"
              placeholder={t.placeholderBusiness}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="eyebrow mb-2 block" htmlFor="select-project-type">
              {t.labelProjectType}
            </label>
            <select
              id="select-project-type"
              name="projectType"
              defaultValue=""
              className={fieldClass}
            >
              <option value="" disabled>
                {t.selectProject}
              </option>
              {t.projectTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="eyebrow mb-2 block" htmlFor="select-budget">
              {t.labelBudget}
            </label>
            <select id="select-budget" name="budget" defaultValue="" className={fieldClass}>
              <option value="" disabled>
                {t.selectBudget}
              </option>
              {t.budgetRanges.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="eyebrow mb-2 block" htmlFor="field-message">
            {t.labelMessage}
          </label>
          <textarea
            id="field-message"
            name="message"
            rows={5}
            required
            placeholder={t.placeholderMessage}
            className={`${fieldClass} resize-y`}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 font-bold text-bg transition-all duration-300 hover:bg-gold-hi hover:shadow-[0_0_38px_-6px_rgb(245_197_24/0.65)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'sending' && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-[spin_0.7s_linear_infinite] rounded-full border-2 border-bg/30 border-t-bg"
            />
          )}
          {status === 'sending' ? t.sending : t.submitButton}
        </button>
      </form>
    </div>
  );
}
