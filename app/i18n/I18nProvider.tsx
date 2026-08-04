"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { organByIdFrom, type Organ, type OrganId } from "../lib/anatomy-data";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";
import { getOrgansForLocale, getUiForLocale, messages } from "./messages";
import { readStoredLocale, writeStoredLocale } from "./storage";
import { translate } from "./translate";

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  locales: readonly Locale[];
  t: TranslateFn;
  organs: Organ[];
  organById: Record<OrganId, Organ>;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeStoredLocale(next);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const ui = getUiForLocale(locale);
    const fallbackUi = messages[DEFAULT_LOCALE].ui;
    const organs = getOrgansForLocale(locale);
    return {
      locale,
      setLocale,
      locales: LOCALES,
      t: (key, params) => translate(ui, key, params, fallbackUi),
      organs,
      organById: organByIdFrom(organs),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
