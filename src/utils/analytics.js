import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga';
import debug from 'debug';
import { Routes } from 'utils/constants';
import references from 'references/config';
const log = debug('maker:analytics');

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'test';
const config = {
  test: {
    userSnap: {
      token: 'def2ae23-a9a8-4f11-85e6-5346cb86d4f2',
      config: {
        fields: {
          email: null
        }
      }
    },
    mixpanel: {
      token: '4ff3f85397ffc3c6b6f0d4120a4ea40a',
      config: { debug: true, ip: false }
    },
    gaTrackingId: 'UA-128164213-4'
  },
  prod: {
    mixpanel: {
      token: 'a030d8845e34bfdc11be3d9f3054ad67',
      config: { ip: false }
    },
    gaTrackingId: 'UA-128164213-3',
    userSnap: {
      token: 'def2ae23-a9a8-4f11-85e6-5346cb86d4f2',
      config: {
        fields: {
          email: null
        }
      }
    }
  }
}[env];

export const getProductName = pathname => {
  return pathname.startsWith(`/${Routes.BORROW}`)
    ? 'Borrow'
    : pathname.startsWith(`/${Routes.SAVE}`)
    ? 'Save'
    : 'Landing';
};

export const getPageName = title => {
  return references.trackingPages[title];
};

export const mixpanelFactory = (product, page, section, props) => {
  const options = {
    product,
    page,
    section,
    ...props
  };
  const trackBtnClick = (id, additionalProps) => {
    mixpanel.track('btn_click', { id, ...options, ...additionalProps });
  };

  const trackInputChange = (id, additionalProps) => {
    mixpanel.track('input_change', { id, ...options, ...additionalProps });
  };

  return { trackBtnClick, trackInputChange };
};

export const mixpanelInit = () => {
  log(
    `[Mixpanel] Tracking initialized for ${env} env using ${
      config.mixpanel.token
    }`
  );
  mixpanel.init(config.mixpanel.token, config.mixpanel.config);
  mixpanel.track('Pageview');
  return mixpanel;
};

export const mixpanelIdentify = (id, walletType) => {
  if (typeof mixpanel.config === 'undefined') return;
  mixpanel.identify(id);
  mixpanel.people.set({ walletType });
};

export const userSnapInit = () => {
  // already injected
  if (document.getElementById('usersnap-script')) return;

  window.onUsersnapLoad = function(api) {
    api.init(config.userSnap.config);
    window.Usersnap = api;
  };

  const scriptUrl = `//api.usersnap.com/load/${
    config.userSnap.token
  }.js?onload=onUsersnapLoad`;
  const script = document.createElement('script');
  script.id = 'usersnap-script';
  script.src = scriptUrl;
  script.async = true;

  document.getElementsByTagName('head')[0].appendChild(script);
};

export const gaInit = () => {
  log(`[GA] Tracking initialized for ${env} env using ${config.gaTrackingId}`);
  ReactGA.initialize(config.gaTrackingId);
  return ReactGA;
};
