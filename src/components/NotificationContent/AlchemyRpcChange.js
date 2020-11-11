import React from 'react';
import useLanguage from 'hooks/useLanguage';
import { Text, Link } from '@makerdao/ui-components-core';

function AlchemyRpcChange() {
  const { lang } = useLanguage();

  return (
    <Text.p>
      {lang.formatString(
        lang.notifications.alchemy_rpc_change,
        <Link href="https://www.notion.so/makerdao/How-to-connect-MetaMask-to-a-Custom-RPC-da53e6f2d1f54fb7abf38decc645a80c">
          {lang.here}
        </Link>
      )}
    </Text.p>
  );
}

export default AlchemyRpcChange;
