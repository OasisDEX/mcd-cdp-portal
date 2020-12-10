import LocalizedStrings from 'react-localization';
import english from './_english.json';
import chinese from './_chinese.json';

export const defaultLocale = 'en';

export const languages = [
  // { value: 'da', text: 'Dansk' },
  // { value: 'de', text: 'Deutsch' },
  { value: 'en', text: 'English' },
  // { value: 'es', text: 'Español' },
  // { value: 'fr', text: 'Français' },
  // { value: 'ja', text: '日本語' },
  // { value: 'ko', text: '한국어' },
  // { value: 'pt-BR', text: 'Português (Brasil)' },
  // { value: 'ru', text: 'Pусский' },
  // { value: 'vi', text: 'Tiếng Việt' },
  { value: 'zh-CN', text: '中文 (简体)' }
];

export default new LocalizedStrings({
  en: english,
  'zh-CN': chinese
});
