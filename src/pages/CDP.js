import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import PageContentLayout from 'layouts/PageContentLayout';
import lang from 'languages';
import { Box, Grid, Flex, Card, Button } from '@makerdao/ui-components-core';
import { Title, TextBlock } from 'components/Typography';
import useMaker from 'hooks/useMaker';

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

function CDPView({ cdpId }) {
  const { maker } = useMaker();

  // TODO cdpTypeSlug should become `id` or we should have both cdpTypeSlug AND id.
  const [cdpState, setCDPState] = useState(null);

  useEffect(() => {
    (async () => {
      const cdpManager = maker.service('mcd:cdpManager');
      const cdp = await cdpManager.getCdp(cdpId);
      setCDPState(cdp);
    })();
  }, [cdpId, maker]);

  console.log('CDP state to be rendered on the page:', cdpState);
  return (
    <PageContentLayout>
      <Box>
        <Title color="black2">
          {lang.cdp} {cdpId}
        </Title>
      </Box>
      <Grid
        py="m"
        gridColumnGap="l"
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
      >
        <CdpViewCard
          title={lang.cdp_page.liquidation_price}
          rows={[
            ['114.92 USD', '(ETH/USD)'],
            [`${lang.cdp_page.current_price_info} (ETH/USD)`, '249.06 USD'],
            [lang.cdp_page.liquidation_penalty, '15%']
          ]}
          isAction={false}
        />

        <CdpViewCard
          title={lang.cdp_page.collateralization_ratio}
          rows={[
            ['171.65 %', '\u00A0'],
            [lang.cdp_page.minimum_ratio, '150.00%'],
            [lang.cdp_page.stability_fee, '2.500%']
          ]}
          isAction={false}
        />

        <CdpViewCard
          title={`${cdpId} ${lang.cdp_page.collateral}`}
          rows={[
            ['5.5 ETH', '4,312.06 USD'],
            [
              lang.cdp_page.locked,
              '3.00 ETH',
              '2,352.03',
              <ActionButton name={lang.actions.deposit} />
            ],
            [
              lang.cdp_page.able_withdraw,
              '2.50 ETH',
              '1,960.03 USD',
              <ActionButton name={lang.actions.withdraw} />
            ]
          ]}
          isAction={true}
        />

        <CdpViewCard
          title={`DAI ${lang.cdp_page.position}`}
          rows={[
            ['10,0001.01 DAI', lang.cdp_page.outstanding_debt],
            [
              `DAI ${lang.cdp_page.wallet_balance}`,
              '3.00 DAI',
              '3.00 USD',
              <ActionButton name={lang.actions.pay_back} />
            ],
            [
              lang.cdp_page.able_generate,
              '4,002.08 DAI',
              '4,002.03 USD',
              <ActionButton name={lang.actions.generate} />
            ]
          ]}
          isAction={true}
        />
      </Grid>
    </PageContentLayout>
  );
}

export default hot(CDPView);
