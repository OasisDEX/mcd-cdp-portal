import React, { createContext, useState } from 'react';
import lang, { languages, defaultLocale } from 'languages';
import { getPreferredLanguage } from 'utils/language';
import debug from 'debug';
const log = debug('maker:LanguageProvider');

export const LanguageContext = createContext();

const getQueryParamByName = name => {
  const match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

function LanguageProvider({ children }) {
  const [locale, setLocale_] = useState(null);

  const setLocale = value => {
    setLocale_(value);
    lang.setLanguage(value);
    if (locale) {
      log(`Language set to: ${value}`);
      window.localStorage.setItem('locale', value);
    }
  };

  // First time load
  if (locale === null) {
    const langOverrideUrl = getQueryParamByName('lang');
    const localOverrideUrl = getQueryParamByName('locale');
    const localeOverrideLocalStorage = window.localStorage.getItem('locale');
    const localeOverrides = [
      langOverrideUrl,
      localOverrideUrl,
      localeOverrideLocalStorage
    ].filter(x => x);

    const detectedLanguage = getPreferredLanguage({
      languages: languages.map(language => language.value),
      overrides: localeOverrides,
      fallback: defaultLocale
    });

    log(`Detected language: ${detectedLanguage}`);
    window.localStorage.setItem('locale', detectedLanguage);
    setLocale(detectedLanguage || 'en');
  }

  return (
    <LanguageContext.Provider value={{ lang, locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;
