import React, { createContext, useState } from 'react';
import lang, { languages, defaultLocale } from 'languages';
import { getPreferredLanguage } from 'utils/language';

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
      console.debug(`Language set to: ${value}`);
      window.localStorage.setItem('locale', value);
    }
  };

  // First time load
  if (locale === null) {
    const localeOverrideUrl = getQueryParamByName('lang');
    const localeOverrideLocalStorage = window.localStorage.getItem('locale');
    const localeOverrides = [];
    localeOverrideUrl && localeOverrides.push(localeOverrideUrl);
    localeOverrideLocalStorage &&
      localeOverrides.push(localeOverrideLocalStorage);

    const detectedLanguage = getPreferredLanguage({
      languages: languages.map(language => language.value),
      overrides: localeOverrides,
      fallback: defaultLocale
    });

    console.debug(`Detected language: ${detectedLanguage}`);
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
