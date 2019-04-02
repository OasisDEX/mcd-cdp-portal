import React from 'react';
import { Text } from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';

const Generate = ({ reset }) => {
  return (
    <SidebarActionLayout onClose={reset}>
      <Text>Generate DAI</Text>
    </SidebarActionLayout>
  );
};
export default Generate;
