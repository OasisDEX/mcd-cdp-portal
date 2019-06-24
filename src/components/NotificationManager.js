import React, { useEffect, useState } from 'react';
import { Card } from '@makerdao/ui-components-core';

import useModal from '../hooks/useModal';
import useMaker from '../hooks/useMaker';

const NotificationManager = ({ ...props }) => {
  const { show } = useModal();
  const { account, maker } = useMaker();
  const [cdpsToMigrate, setCdpsToMigrate] = useState(0);

  useEffect(() => {
    if (!account) return;
    const getCdps = async () => {
      try {
        const proxyAddress = await maker.service('proxy').currentProxy();
        const cdps = await maker.service('cdp').getCdpIds(proxyAddress);
        setCdpsToMigrate(cdps.length);
      } catch (err) {
        // ignore
      }
    };
    getCdps();
  }, [account]);

  return account && cdpsToMigrate > 0 ? (
    <Card
      p="s"
      css={{ cursor: 'pointer' }}
      onClick={() =>
        show({ modalType: 'cdpmigrate', modalTemplate: 'fullscreen' })
      }
      {...props}
    >
      {cdpsToMigrate} CDP{cdpsToMigrate > 1 && 's'} to migrate
    </Card>
  ) : (
    <></>
  );
};

export default NotificationManager;
