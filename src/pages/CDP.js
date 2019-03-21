import React from 'react';
import { hot } from 'react-hot-loader/root';
import PageContentLayout from 'layouts/PageContentLayout';
// import lang from 'languages'; TODO - localization
import { Box, Grid, Flex, Card, Button } from '@makerdao/ui-components-core';
import { Title, TextBlock } from 'components/Typography';

function CardTitle({ title }) {
  return (
    <TextBlock t="headingS" fontWeight="medium">
      {title}
    </TextBlock>
  );
}

const TopContainerRow = ({ props }) => {
  const [title, value] = props;
  const [titleText, titleCurrency] = title.split(' ');
  return (
    <Flex flexWrap="wrap" alignItems="flex-end">
      <TextBlock t="headingL" fontWeight="medium">
        {titleText} &nbsp;
      </TextBlock>
      <TextBlock t="textL" fontWeight="medium">
        {titleCurrency} &nbsp;
      </TextBlock>
      <TextBlock m="m" t="textM" color="gray2">
        {value}
      </TextBlock>
    </Flex>
  );
};

const InfoContainerRow = ({ props }) => {
  const [title, value] = props;
  const [rowInfoTitle, ...rowInfoLabel] = title.split(/( \()/g);
  return (
    <Flex py="xs" flexWrap="wrap">
      <Flex flexGrow="1">
        <TextBlock t="p3" color="black4">
          {rowInfoTitle}
        </TextBlock>
        <TextBlock t="p3" color="gray2">
          {rowInfoLabel}
        </TextBlock>
      </Flex>
      <Box>
        <TextBlock t="p2" color="black4">
          {value}
        </TextBlock>
      </Box>
    </Flex>
  );
};

const ActionContainerRow = ({ props }) => {
  const [title, value, conversion, button] = props;
  return (
    <Flex flexWrap="wrap" justifyContent="space-between" py="s">
      <Box alignSelf="center" width="140px">
        <TextBlock t="p3" color="black4">
          {title}
        </TextBlock>
      </Box>
      <Box flexGrow="1">
        <Box display="flex">
          <Box flexGrow="1" />
          <Box alignSelf="center">
            <Flex flexDirection="column" width="150px" pr="15px">
              <TextBlock t="p2" textAlign="right">
                {value}
              </TextBlock>
              <TextBlock t="p3" textAlign="right">
                {conversion}
              </TextBlock>
            </Flex>
          </Box>
          <Box alignSelf="center">{button}</Box>
        </Box>
      </Box>
    </Flex>
  );
};

const ActionButton = ({ name, onClick }) => (
  <Button width="100px" p="xs" variant="secondary" onClick={onClick}>
    <TextBlock t="p5" color="black4">
      {name}
    </TextBlock>
  </Button>
);

const CdpViewCard = ({ title, rows, isAction }) => {
  const [titleRow, middleRow, bottomRow] = rows;
  return (
    <Box my="s">
      <CardTitle title={title} />
      <Card px="m" py="s" my="s">
        <TopContainerRow props={titleRow} />
        {isAction ? (
          <ActionContainerRow props={middleRow} />
        ) : (
          <InfoContainerRow props={middleRow} />
        )}
        <Box borderBottom="1px solid" borderColor="grayLight4" />
        {isAction ? (
          <ActionContainerRow props={bottomRow} />
        ) : (
          <InfoContainerRow props={bottomRow} />
        )}
      </Card>
    </Box>
  );
};

function CDPView({ cdpTypeSlug }) {
  return (
    <PageContentLayout>
      <Box>
        <Title color="black2">
          {/* cdpTypeSlug.toUpperCase()} {lang.cdp */}
          Ethereum CDP
        </Title>
      </Box>
      <Grid
        py="m"
        gridColumnGap="l"
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
      >
        <CdpViewCard
          title="Liquidation price"
          rows={[
            ['114.92 USD', '(ETH/USD)'],
            ['Current price information (ETH/USD)', '249.06 USD'],
            ['Liquidation penalty', '15%']
          ]}
          isAction={false}
        />

        <CdpViewCard
          title="ETH Collateral"
          rows={[
            ['171.65 %', '\u00A0'],
            ['Minimum ratio', '150.00%'],
            ['Stability Fee', '2.500%']
          ]}
          isAction={false}
        />

        <CdpViewCard
          title="Collateralization Ratio"
          rows={[
            ['5.5 ETH', '4,312.06 USD'],
            ['Locked', '3.00 ETH', '2,352.03', <ActionButton name="Deposit" />],
            [
              'Able to withdraw',
              '2.50 ETH',
              '1,960.03 USD',
              <ActionButton name="Withdraw" />
            ]
          ]}
          isAction={true}
        />

        <CdpViewCard
          title="DAI position"
          rows={[
            ['10,0001.01 DAI', 'Outstanding debt'],
            [
              'DAI wallet balance',
              '3.00 DAI',
              '3.00 USD',
              <ActionButton name="Pay back" />
            ],
            [
              'Able to generate',
              '4,002.08 DAI',
              '4,002.03 USD',
              <ActionButton name="Generate" />
            ]
          ]}
          isAction={true}
        />
      </Grid>
    </PageContentLayout>
  );
}

export default hot(CDPView);
