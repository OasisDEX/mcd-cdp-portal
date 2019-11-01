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

  // this workaround (making useMemo depend on just one feed item) ensures that
  // the view does not re-render when an irrelevant price feed is updated.
  // TODO: there's definitely a more general solution to this issue, but i'm not
  // going to try to figure it out right now. let's collect more data first
  // about how it shows up in different situations.
  const ilk = cdps[cdpId] ? cdps[cdpId].ilk : null;
  const feed = ilk ? feeds.find(f => f.key === ilk) : null;
  const cdp = useMemo(() => getCdp(cdpId, { cdps, feeds: [feed] }), [
    cdpId,
    cdps,
    feed
  ]);

  useEffect(() => {
    trackCdpById(maker, cdpId, dispatch);
  }, [cdpId, dispatch, maker]);

  return useMemo(
    () =>
      cdp.inited ? (
        <CDPViewPresentation
          cdp={cdp}
          showSidebar={showSidebar}
          account={account}
          network={network}
        />
      ) : (
        <LoadingLayout background={getColor('backgroundGrey')} />
      ),
    [cdp, showSidebar, account, network]
  );
}

export default hot(CDPView);
