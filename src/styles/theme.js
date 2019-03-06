import { themeLight } from '@makerdao/ui-components-core';
const { colors, typography } = themeLight;

const theme = {
  ...themeLight,
  colors: {
    grayLight: '#f8f8f8',
    grayLight2: '#c2c2c2',
    grayLight3: '#e0e0e0',
    greenPastel: '#1aab9b',
    greenVivid: '#24be9f',
    purple: '#690496',
    black: '#000',
    black2: '#231536',
    black3: '#48495f',
    black4: '#4f445e',
    blackLight: '#383838',
    redVivid: '#f65728',
    ...colors
  },
  typography: {
    p6: {
      fontSize: '1.2rem',
      lineHeight: '17px'
    },
    ...typography
  }
};

console.log(theme, 'theme here');
export default theme;

export function useSpace(key) {
  return theme.space[key];
}

export function useColor(key) {
  return theme.colors[key];
}
