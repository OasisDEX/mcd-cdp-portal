import { themeLight } from '@makerdao/ui-components-core';
const { colors, typography } = themeLight;

const theme = {
  ...themeLight,
  colors: {
    gray2: '#8D8EA7',
    grayLight: '#f8f8f8',
    grayLight2: '#c2c2c2',
    grayLight3: '#e0e0e0',
    grayLight4: '#9AA3AD',
    grayLight5: '#F6F8F9',
    grayLight6: '#E9EAF3',
    grayLight7: '#E4EAEE',
    greenDark: '#1A9083',
    greenPastel: '#1aab9b',
    greenPastelLight: '#eaf7f6',
    greenVivid: '#24be9f',
    purple: '#690496',
    black: '#000',
    black2: '#231536',
    black3: '#48495f',
    black4: '#4f445e',
    black5: '#222',
    blackLight: '#383838',
    redVivid: '#f65728',
    redDark: '#994126',
    redPastel: '#FFF0EB',
    yellowDark: '#A87807',
    yellowPastel: '#fee8b4',
    ...colors
  },
  typography: {
    p6: {
      fontSize: '1.2rem',
      lineHeight: '17px'
    },

    smallCaps: {
      fontSize: '1.2rem',
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      lineHeight: '22px'
    },

    ...typography
  },
  measurement: {
    sidebarWidth: '315px',
    navbarWidth: '80px'
  }
};

export default theme;

export function getMeasurement(key) {
  return theme.measurement[key];
}

export function getSpace(key) {
  return theme.space[key];
}

export function getColor(key) {
  return theme.colors[key];
}
