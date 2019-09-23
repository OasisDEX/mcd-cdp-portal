// Checks if input starts with string
const startsWith = (input, string) => input.indexOf(string) === 0;

// Some browsers report language as en-US instead of en_US
const normalizeCode = code =>
  code ? code.toLowerCase().replace(/-/, '_') : null;

const getBrowserLang = () =>
  typeof window === 'undefined'
    ? null
    : normalizeCode(
        (window.navigator.languages && window.navigator.languages[0]) ||
          window.navigator.language ||
          window.navigator.browserLanguage ||
          window.navigator.userLanguage ||
          window.navigator.systemLanguage ||
          null
      );

export const getPreferredLanguage = options => {
  const { languages, overrides, fallback } = options;

  if (overrides) {
    for (let override of overrides) {
      const match = languages.find(
        lang => normalizeCode(lang) === normalizeCode(override)
      );
      if (match) return match;
    }
  }

  const browserLanguage = getBrowserLang();

  if (!options) return browserLanguage;
  if (!languages || !browserLanguage) return fallback;

  const match = languages.filter(
    lang => normalizeCode(lang) === browserLanguage
  );
  if (match.length > 0) return match[0] || fallback;

  // en == en_US
  const matchCodeOnly = languages.filter(lang =>
    startsWith(browserLanguage, lang.substr(0, 2))
  );

  return matchCodeOnly[0] || fallback;
};
