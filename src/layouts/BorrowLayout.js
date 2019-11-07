import React from 'react';
import { Grid, Box } from '@makerdao/ui-components-core';

import { hot } from 'react-hot-loader/root';
import SidebarBase from 'components/SidebarBase';
import theme, { getSpace } from '../styles/theme';
import useBanner from '../hooks/useBanner';
import useLanguage from 'hooks/useLanguage';

const ResponsivePageLayout = ({ mobileNav, navbar, children }) => {
  const { current, shouldShow } = useBanner();

  console.log('should show from hook', shouldShow);

  const { lang } = useLanguage();
  const { component: BannerComponent } = current;
  const message = lang.formatString(
    'Your {0} Vault auction(s) have completed. You have {1} {2} to claim',
    'CollateralName',
    '5.55',
    'SYM'
  );
  const onClick = () => console.log('ON CLICK WORKS');
  const buttonLabel = 'click';

  return (
    <Grid
      bg="lightGrey"
      gridTemplateColumns={{
        s: 'minmax(0, 1fr)',
        l: `${theme.measurement.navbarWidth}px 1fr ${
          theme.measurement.sidebarWidth
        }px ${getSpace('s')}px`
      }}
      gridTemplateRows={{
        s: 'auto 1fr',
        l: 'auto'
      }}
      width="100%"
    >
      <Box display={{ s: 'block', l: 'none' }}>{mobileNav}</Box>
      <Box display={{ s: 'none', l: 'block' }}>{navbar}</Box>
      <div>
        {shouldShow && (
          <BannerComponent
            message={message}
            onClick={onClick}
            buttonLabel={buttonLabel}
          />
        )}
        {children}
      </div>

      <Box display={{ s: 'none', l: 'block' }}>
        <SidebarBase />
      </Box>
    </Grid>
  );
};

export default hot(ResponsivePageLayout);
