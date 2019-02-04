import mixpanel from 'mixpanel-browser';
const env = process.env.NODE_ENV === 'production' ? 'prod' : 'test';
const token = {
  test: '4ff3f85397ffc3c6b6f0d4120a4ea40a',
  prod: 'a030d8845e34bfdc11be3d9f3054ad67'
};

export const mixpanelInit = () => {
  console.log(token[env]);
  mixpanel.init(token[env]);
  mixpanel.track('Pageview');
};

export const mixpanelIdentify = (id, walletType) => {
  mixpanel.identify(id);
  mixpanel.people.set({ walletType });
};

export const mixpanelTrackNavigation = navigation => {
  navigation.subscribe(snapshot => {
    const { route } = snapshot;
    if (route.type === 'page') {
      mixpanel.track('Pageview', { routeName: route.title });
      console.log('tracked');
    }
  });
};
