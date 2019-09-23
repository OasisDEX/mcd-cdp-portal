import { useContext } from 'react';
import { LanguageContext } from 'providers/LanguageProvider';

const useLanguage = () => {
  const { lang, locale, setLocale } = useContext(LanguageContext);
  return { lang, locale, setLocale };
};

export default useLanguage;
