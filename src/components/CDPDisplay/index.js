import React, { useEffect, useMemo } from 'react';
import { hot } from 'react-hot-loader/root';
import LoadingLayout from 'layouts/LoadingLayout';
import { getColor } from 'styles/theme';
import useMaker from 'hooks/useMaker';
import useSidebar from 'hooks/useSidebar';
import useStore from 'hooks/useStore';
import { getCdp } from 'reducers/cdps';
import { trackCdpById } from 'reducers/multicall/cdps';
import CDPViewPresentation from './Presentation';

function CDPView({ cdpId }) {
  cdpId = parseInt(cdpId, 10);
  const { maker, account, network } = useMaker();
  const { show: showSidebar } = useSidebar();
  const [{ cdps, feeds }, dispatch] = useStore();
  const cdp = useMemo(() => getCdp(cdpId, { cdps, feeds }), [
    cdpId,
    cdps,
    feeds
  ]);

  useEffect(() => {
    trackCdpById(maker, cdpId, dispatch);
  }, [cdpId, maker]);

  return useMemo(
    () =>
      cdp.inited ? (
        <CDPViewPresentation
          cdp={cdp}
          cdpId={cdpId}
          showSidebar={showSidebar}
          account={account}
          owner={account && account.cdps.some(userCdp => userCdp.id === cdpId)}
          network={network}
        />
      ) : (
        <LoadingLayout background={getColor('backgroundGrey')} />
      ),
    [cdp, cdpId, showSidebar, account]
  );
}

export default hot(CDPView);
