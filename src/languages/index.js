import LocalizedStrings from 'react-localization';

import chinese from './_chinese';
import danish from './_danish';
import english from './_english';
import french from './_french';
import german from './_german';
import italian from './_italian';
import japanese from './_japanese';
import korean from './_korean';
import portuguese from './_portuguese';
import russian from './_russian';
import spanish from './_spanish';

export const defaultLocale = 'en';

export const languages = [
  { value: 'da', text: 'Dansk' },
  { value: 'de', text: 'Deutsch' },
  { value: 'en', text: 'English' },
  { value: 'es', text: 'Español' },
  { value: 'fr', text: 'Français' },
  { value: 'it', text: 'Italiano' },
  { value: 'ja', text: '日本語' },
  { value: 'ko', text: '한국어' },
  { value: 'pt-BR', text: 'Português (Brasil)' },
  { value: 'ru', text: 'Pусский' },
  { value: 'zh-CN', text: '中文 (简体)' },
];

export default new LocalizedStrings({
  'zh-CN': chinese,
  'da': danish,
  'en': english,
  'fr': french,
  'de': german,
  'it': italian,
  'ja': japanese,
  'ko': korean,
  'pt-BR': portuguese,
  'ru': russian,
  'es': spanish,
});

/*
Paste in terminal to open all langs:

open http://localhost:3000/?lang=da
open http://localhost:3000/?lang=de
open http://localhost:3000/?lang=en
open http://localhost:3000/?lang=es
open http://localhost:3000/?lang=fr
open http://localhost:3000/?lang=it
open http://localhost:3000/?lang=ja
open http://localhost:3000/?lang=ko
open http://localhost:3000/?lang=pt-BR
open http://localhost:3000/?lang=ru
open http://localhost:3000/?lang=zh-CN

 */
