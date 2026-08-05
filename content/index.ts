import type { Dictionary, Lang } from './types';
import { sq } from './sq';
import { en } from './en';

const DICTIONARIES: Record<Lang, Dictionary> = { sq, en };

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}

/** Narrows an unvalidated route param to a Lang, defaulting to Albanian. */
export function toLang(value: string | undefined): Lang {
  return value === 'en' ? 'en' : 'sq';
}

export * from './types';
export * from './shared';
