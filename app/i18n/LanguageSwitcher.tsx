"use client";

import { LOCALE_LABELS } from "./config";
import { useI18n } from "./useI18n";

export function LanguageSwitcher() {
  const { locale, setLocale, locales, t } = useI18n();

  return (
    <div className="language-switcher" role="group" aria-label={t("language.label")}>
      {locales.map((code) => {
        const label = LOCALE_LABELS[code];
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            className={active ? "active" : undefined}
            aria-pressed={active}
            aria-label={t("language.switchTo", { label })}
            onClick={() => setLocale(code)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
