import React, { useEffect, useState, useMemo } from 'react';
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
  const [cdpOwner, setOwner] = useState();

  useEffect(() => {
    (async () => {
      const proxyAddress = await maker
        .service('mcd:cdpManager')
        .getOwner(cdpId);
      const cdpOwnerAddress = await maker
        .service('proxy')
        .getOwner(proxyAddress);
      setOwner(cdpOwnerAddress);
    })();
  }, [maker, cdpId]);

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
      cdp.inited && cdpOwner ? (
        <CDPViewPresentation
          cdp={cdp}
          showSidebar={showSidebar}
          account={account}
          network={network}
          cdpOwner={cdpOwner.toLowerCase()}
        />
      ) : (
        <LoadingLayout background={getColor('lightGrey')} />
      ),
    [cdp, showSidebar, account, network, cdpOwner]
  );
}

export default hot(CDPView);
