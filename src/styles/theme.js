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

export const marketingTheme = (() => {
  const mColors = {
    purpleGray: '#2F3044',
    violetGray: '#443854'
  };
  const mFont = "'FT Base', Arial, Helvetica, sans-serif";
  const mHeading = {
    display: 'block',
    fontFamily: mFont,
    fontWeight: 'bold',
    color: theme.colors.darkPurple
  };

  return {
    ...theme,
    colors: {
      ...theme.colors,
      ...mColors
    },
    typography: {
      ...theme.typography,
      h1: {
        ...mHeading,
        fontSize: '4.8rem',
        lineHeight: '58px'
      },
      h2: {
        ...mHeading,
        fontSize: '4rem',
        lineHeight: '48px'
      },
      h3: {
        ...mHeading,
        fontSize: '3.2rem',
        lineHeight: '38px'
      },
      h4: {
        ...mHeading,
        fontSize: '2.0rem',
        lineHeight: '27px'
      },
      body: {
        fontFamily: mFont,
        fontSize: '1.8rem',
        lineHeight: '28px',
        letterSpacing: '0.5px',
        color: mColors.violetGray
      }
    },
    fontSizes: {
      ...theme.fontSizes,
      s: '1.6rem'
    },
    mobilePaddingX: '12px' // used for making some components full width on mobile
  };
})();

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
