import { buildOrgans, type Organ, type OrganId, type OrganLocaleContent } from "../../lib/anatomy-data";
import type { Locale } from "../config";
import { DEFAULT_LOCALE } from "../config";
import { organsEn } from "./en/organs";
import { uiEn, type UiMessages } from "./en/ui";
import { organsEs } from "./es/organs";
import { uiEs } from "./es/ui";

export type LocaleBundle = {
  ui: UiMessages;
  organs: Record<OrganId, OrganLocaleContent>;
};

/**
 * Registry of locale catalogs. To add a language:
 * 1. Create `messages/<code>/ui.ts` and `organs.ts`
 * 2. Add the code to `LOCALES` in `config.ts`
 * 3. Register the bundle here
 */
export const messages: Record<Locale, LocaleBundle> = {
  en: { ui: uiEn, organs: organsEn },
  es: { ui: uiEs, organs: organsEs },
};

const organCache = new Map<Locale, Organ[]>();

export function getOrgansForLocale(locale: Locale): Organ[] {
  const cached = organCache.get(locale);
  if (cached) return cached;
  const bundle = messages[locale] ?? messages[DEFAULT_LOCALE];
  const organs = buildOrgans(bundle.organs);
  organCache.set(locale, organs);
  return organs;
}

export function getUiForLocale(locale: Locale): UiMessages {
  return (messages[locale] ?? messages[DEFAULT_LOCALE]).ui;
}
