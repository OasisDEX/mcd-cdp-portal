import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Text,
  Flex,
  Card
} from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import TwoColumnCardsLayout from 'layouts/TwoColumnCardsLayout';
import { TxLifecycle } from 'utils/constants';

const ScreenHeader = ({ title, text }) => {
  return (
    <Box textAlign="center" py="m">
      <Box pb="xs">
        <TextBlock t="headingL">{title}</TextBlock>
      </Box>
      <TextBlock t="textL" color="gray2">
        {text}
      </TextBlock>
    </Box>
  );
};

const ScreenFooter = ({ setStep, loading, screenIndex }) => {
  return (
    <Flex textAlign="center" justifyContent="center">
      <Button
        width="110px"
        variant="secondary-outline"
        mx="xs"
        onClick={() => {
          setStep(screenIndex - 1);
        }}
      >
        Back
      </Button>
      <Button
        // loading={}
        loading={loading}
        width="145px"
        mx="xs"
        onClick={() => {
          setStep(screenIndex + 1);
        }}
      >
        Continue
      </Button>
    </Flex>
  );
};

const CDPCreateSelectCollateralSidebar = () => (
  <Box p="m">
    <TextBlock t="headingS" fontWeight="medium">
      Risk Parameters
    </TextBlock>
    <Box mt="m">
      {[
        [
          'Stability Fee',
          'The fee calculated on top of the existing debt of the CDP. This is paid when paying back Dai.'
        ],
        [
          'Liquidation Ratio',
          'The collateral-to-dai ratio at which a CDP becomes vulnerable to liquidation. '
        ],
        [
          'Liquidation Fee',
          'The fee that is added to the total outstanding DAI debt when a liquidation occurs.'
        ]
      ].map(([title, text]) => (
        <Box mb="m">
          <TextBlock t="textM" fontWeight="medium">
            {title}
          </TextBlock>
          <TextBlock t="textS" color="black3">
            {text}
          </TextBlock>
        </Box>
      ))}
    </Box>
  </Box>
);

const CDPCreateSelectCollateral = ({ createProxyTx, setStep, screenIndex }) => {
  return (
    <Box>
      <ScreenHeader
        title="Select a collateral type"
        text="Each collateral type has its own risk parameters. You can lock up additional collateral types later."
      />
      <Box my="l">
        <TwoColumnCardsLayout
          mainContent={<div>{"I'm a table y'all"}</div>}
          sideContent={<CDPCreateSelectCollateralSidebar />}
        />
      </Box>
      <ScreenFooter
        screenIndex={screenIndex}
        setStep={setStep}
        loading={createProxyTx.status === TxLifecycle.PENDING}
        screenIndex={3}
      />
    </Box>
  );
};

const CDPCreateDeposit = ({ createProxyTx, setStep, screenIndex }) => {
  return (
    <Box>
      <ScreenHeader
        title="Select a collateral type"
        text="Each collateral type has its own risk parameters. You can lock up additional collateral types later."
      />
      <Box my="l">
        <TwoColumnCardsLayout
          mainContent={<div>🤑</div>}
          sideContent={<CDPCreateSelectCollateralSidebar />}
          sidebarAsCard={false}
        />
      </Box>
      <ScreenFooter
        screenIndex={screenIndex}
        setStep={setStep}
        loading={createProxyTx.status === TxLifecycle.PENDING}
        screenIndex={3}
      />
    </Box>
  );
};

const CDPCreateConfirmCDP = ({ createProxyTx, setStep, screenIndex }) => {
  return (
    <Box>
      <ScreenHeader
        title="Select a collateral type"
        text="Each collateral type has its own risk parameters. You can lock up additional collateral types later."
      />
      <Box my="l">
        <Card>Confirmation</Card>
        {/* <TwoColumnCardsLayout sideContent={<CDPCreateSelectCollateralSidebar />} /> */}
      </Box>
      <ScreenFooter
        screenIndex={screenIndex}
        setStep={setStep}
        loading={createProxyTx.status === TxLifecycle.PENDING}
        screenIndex={3}
      />
    </Box>
  );
};

export { CDPCreateSelectCollateral, CDPCreateConfirmCDP, CDPCreateDeposit };
