import { themeLight } from '@makerdao/ui-components-core';
const { colors, typography } = themeLight;

const theme = {
  ...themeLight,
  colors: {
    white: '#fff',
    gray2: '#8D8EA7',
    grayLight: '#f8f8f8',
    grayLight2: '#c2c2c2',
    grayLight3: '#e0e0e0',
    grayLight4: '#9AA3AD',
    grayLight5: '#F6F8F9',
    grayLight6: '#E9EAF3',
    grayLight7: '#E4EAEE',
    greenPastel: '#1aab9b',
    greenVivid: '#24be9f',
    purple: '#690496',
    steel: '#708390',
    black: '#000',
    black2: '#231536',
    black3: '#48495f',
    black4: '#4f445e',
    black5: '#222',
    blackLight: '#383838',
    redVivid: '#f65728',
    yellowDark: '#A87807',
    yellowPastel: '#fee8b4',
    ...colors
  },
  typography: {
    p6: {
      fontSize: '1.2rem',
      lineHeight: '17px'
    },

    headingL: {
      fontSize: '3.2rem',
      lineHeight: '31px',
      letterSpacing: '0.3px'
    },

    headingS: {
      fontSize: '2rem',
      lineHeight: '20px',
      letterSpacing: '0.3px'
    },

    textL: {
      fontSize: '1.8rem',
      lineHeight: '22px'
    },

    textM: {
      fontSize: '1.6rem',
      lineHeight: '20px'
    },

    textS: {
      fontSize: '1.4rem',
      lineHeight: '22px'
    },

    body: {
      fontSize: '1.5rem',
      color: '#48495F'
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
