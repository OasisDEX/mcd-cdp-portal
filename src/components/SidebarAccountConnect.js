import React from 'react';

import lang from 'languages';

import styled from 'styled-components';

import { Button } from '@makerdao/ui-components-core';
import useMaker from 'hooks/useMaker';

const CustomButton = styled(Button)`
  height: 30px;
  margin-left: 30px;
  padding: 0px 26px;
`;

export default function AccountConnect() {
  const { connectMetamask } = useMaker();

  const connectOnClick = async () => {
    await connectMetamask();
  };

  return (
    <>
      <span>{lang.sidebar.read_only_mode}</span>
      <CustomButton onClick={connectOnClick} variant="secondary-outline">
        {lang.connect}
      </CustomButton>
    </>
  );
}
