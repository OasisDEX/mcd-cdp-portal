import React, { useState, useEffect } from 'react';
import { NavHistory } from 'react-navi';
import { Button } from '@makerdao/ui-components';
import maker from 'maker';

function MetaMaskConnect({ history }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    maker.authenticate().then(() => {
      setAuthenticated(true);
    });
  }, []);

  return (
    <Button
      disabled={!authenticated}
      onClick={async () => {
        const account = await maker.addAccount({ type: 'browser' });
        const { address } = account;
        history.push({
          pathname: '/overview',
          search: `?address=${address}`
        });
      }}
    >
      Connect with MetaMask
    </Button>
  );
}

export default () => {
  return (
    <NavHistory>{history => <MetaMaskConnect history={history} />}</NavHistory>
  );
};
