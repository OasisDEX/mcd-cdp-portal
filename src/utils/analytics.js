import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga';

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'test';
const config = {
  test: {
    mixpanel: {
      token: '4ff3f85397ffc3c6b6f0d4120a4ea40a',
      config: { debug: true }
    },
    gaTrackingId: 'UA-128164213-4'
  },
  prod: {
    mixpanel: {
      token: 'a030d8845e34bfdc11be3d9f3054ad67',
      config: {}
    },
    gaTrackingId: 'UA-128164213-3'
  }
};

export const mixpanelInit = navigation => {
  console.debug(
    `[Mixpanel] Tracking initialized for ${env} env using ${
      config[env].mixpanel.token
    }`
  );
  mixpanel.init(config[env].mixpanel.token, config[env].mixpanel.config);
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

export const gaInit = async navigation => {
  console.debug(
    `[GA] Tracking initialized for ${env} env using ${config[env].gaTrackingId}`
  );
  ReactGA.initialize(config[env].gaTrackingId);
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
