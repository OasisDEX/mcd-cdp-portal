import { themeLight } from '@makerdao/ui-components-core';
import { SAFETY_LEVELS } from 'utils/constants';
const { colors, typography, space, fontSizes } = themeLight;

const theme = {
  ...themeLight,
  breakpoints: {
    ...themeLight.breakpoints,
    xl: '1150px'
  },
  colors: {
    spinner: '#9FAFB9',
    blackLight: '#222',
    blackLighter: '#383838',
    blueGray: '#1E2C37',
    blueGrayDarker: '#18232C',
    blueGrayLighter: '#31424E',
    red: '#F75524',
    ...colors
  },
  typography: {
    p6: {
      fontSize: '1.2rem',
      lineHeight: '17px'
    },
    large: {
      fontSize: '1.8rem',
      lineHeight: '1',
      fontWeight: '500',
      fontFamily:
        "-apple-system, system-ui, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
      color: '#231536'
    },
    smallCaps: {
      fontSize: '1.1rem',
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
  },
  space: {
    ...space,
    s2: 10,
    sm: 16
  },
  fontSizes: {
    ...fontSizes,
    s2: 13
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

export function getSafetyLevels({ level, overrides = {} }) {
  const levels = {
    textColor: '700',
    backgroundColor: '100',
    borderColor: '400'
  };
  const { DANGER, WARNING, NEUTRAL, SAFE } = SAFETY_LEVELS;
  const colorPairings = {
    [DANGER]: 'orange',
    [WARNING]: 'yellow',
    [NEUTRAL]: 'slate',
    [SAFE]: 'teal'
  };

  return Object.entries(levels).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: overrides[k] ? overrides[k] : `${colorPairings[level]}.${v}`
    }),
    {}
  );
}
