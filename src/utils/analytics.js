import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga';

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

export const mixpanelInit = navigation => {
  console.debug(
    `[Mixpanel] Tracking initialized for ${env} env using ${
      config.mixpanel.token
    }`
  );
  mixpanel.init(config.mixpanel.token, config.mixpanel.config);
  mixpanel.track('Pageview');
  navigation.subscribe(snapshot => {
    const { route } = snapshot;
    if (route.type === 'page') {
      mixpanel.track('Pageview', { routeName: route.title });
      console.debug(`[Mixpanel] Tracked: ${route.title}`);
    }
  });
};

export const mixpanelIdentify = (id, walletType) => {
  if (typeof mixpanel.config === 'undefined') return;
  mixpanel.identify(id);
  mixpanel.people.set({ walletType });
};

export const userSnapInit = () => {
  window.onUsersnapLoad = function(api) {
    api.init(config.userSnap.config);
    window.Usersnap = api;
  };

  const scriptUrl = `//api.usersnap.com/load/${
    config.userSnap.token
  }.js?onload=onUsersnapLoad`;
  const script = document.createElement('script');

  script.src = scriptUrl;
  script.async = true;

  document.getElementsByTagName('head')[0].appendChild(script);
};

export const gaInit = async navigation => {
  console.debug(
    `[GA] Tracking initialized for ${env} env using ${config.gaTrackingId}`
  );
  ReactGA.initialize(config.gaTrackingId);
  const { route } = navigation.getCurrentValue();
  if (route.status === 'ready') {
    console.debug(`[GA] Tracked initial pageview: ${route.url.href}`);
    ReactGA.pageview(route.url.href);
  }
  navigation.subscribe(({ route }) => {
    if (route.type === 'page') {
      console.debug(`[GA] Tracked pageview: ${route.url.href}`);
      ReactGA.pageview(route.url.href);
    }
  });
};
