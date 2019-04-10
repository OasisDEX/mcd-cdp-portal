import React from 'react';
import lang from 'languages';
import { Button, Text } from '@makerdao/ui-components-core';
import useMaker from 'hooks/useMaker';

export default function AccountConnect() {
  const { connectMetamask } = useMaker();

  const connectOnClick = async () => {
    try {
      await connectMetamask();
    } catch (err) {
      window.alert(err);
    }
  };

  return (
    <>
      <Text t="p5">{lang.sidebar.read_only_mode}</Text>
      <Button
        ml="auto"
        px="s"
        py="xs"
        height="auto"
        onClick={connectOnClick}
        variant="secondary-outline"
      >
        {lang.connect}
      </Button>
    </>
  );
}
