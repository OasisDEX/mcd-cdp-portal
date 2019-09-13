import { themeLight } from '@makerdao/ui-components-core';
const { colors, typography } = themeLight;

const theme = {
  ...themeLight,
  breakpoints: {
    ...themeLight.breakpoints,
    xl: '1150px'
  },
  colors: {
    blackLight: '#222',
    blackLighter: '#383838',
    blueGray: '#1E2C37',
    blueGrayDarker: '#18232C',
    blueGrayLighter: '#31424E',
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
    sidebarWidth: 318,
    navbarWidth: 80,
    mobileNavHeight: 80,
    navbarItemWidth: 70,
    navbarItemHeight: 55
  }
};

export default theme;

// the following two functions are taken directly from styled-system
// for a more flexible theme getter
const is = n => n !== undefined && n !== null;

function get(obj, ...paths) {
  const value = paths.reduce((acc, path) => {
    if (is(acc)) return acc;
    const keys = typeof path === 'string' ? path.split('.') : [path];
    return keys.reduce((a, key) => (a && is(a[key]) ? a[key] : null), obj);
  }, null);
  return is(value) ? value : paths[paths.length - 1];
}

export function getMeasurement(key) {
  return get(theme.measurement, key);
}

export function getSpace(key) {
  return get(theme.space, key);
}

export function getColor(key) {
  return get(theme.colors, key);
}
