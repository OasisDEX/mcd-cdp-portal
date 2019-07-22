import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import PageContentLayout from 'layouts/PageContentLayout';
import lang from 'languages';
import {
  Text,
  Grid,
  Card,
  Table,
  Box,
  Button,
  Flex
} from '@makerdao/ui-components-core';
import { Link, useCurrentRoute } from 'react-navi';
import useMaker from 'hooks/useMaker';
import round from 'lodash/round';
import RatioDisplay from '../components/RatioDisplay';
import useStore from 'hooks/useStore';
import {
  getCdp,
  getDebtAmount,
  getCollateralAmount,
  getCollateralValueUSD,
  getCollateralizationRatio,
  getCollateralAvailableAmount
} from 'reducers/cdps';

const InfoCard = ({ title, amount, denom }) => (
  <Card py={{ s: 'm', m: 'l' }} px="m" minWidth="22.4rem">
    <Grid gridRowGap="s">
      <Text
        justifySelf={{ s: 'left', m: 'center' }}
        t="subheading"
        css={`
          white-space: nowrap;
        `}
      >
        {title.toUpperCase()}
      </Text>
      <Box justifySelf={{ s: 'left', m: 'center' }}>
        <Box display={{ s: 'none', m: 'unset' }}>
          <Flex alignSelf="end" alignItems="flex-end">
            <Text.h3>{amount}</Text.h3>&nbsp;<Text.h4>{denom}</Text.h4>
          </Flex>
        </Box>
        <Text.h4 display={{ s: 'unset', m: 'none' }}>
          {amount} {denom}
        </Text.h4>
      </Box>
    </Grid>
  </Card>
);

function Overview() {
  const { account } = useMaker();
  const [{ cdps, feeds }] = useStore();
  const [totalCollateralUSD, setTotalCollateralUSD] = useState(0);
  const [totalDaiDebt, setTotalDaiDebt] = useState(0);
  const [cdpContent, setCdpContent] = useState(null);
  const { url } = useCurrentRoute();

  useEffect(() => {
    if (((account || {}).cdps || {}).length) {
      buildCdpOverview();
    }
  }, [account, cdps, feeds]);

  const buildCdpOverview = async () => {
    try {
      const cdpData = await Promise.all(
        account.cdps.map(({ id }) => {
          const cdp = getCdp(id, { cdps, feeds });
          return {
            token: cdp.gem,
            id,
            ratio: getCollateralizationRatio(cdp),
            deposited: getCollateralAmount(cdp),
            withdraw: getCollateralAvailableAmount(cdp),
            debt: getDebtAmount(cdp),
            depositedUSD: getCollateralValueUSD(cdp)
          };
        })
      );
      const sumDeposits = cdpData.reduce(
        (acc, { depositedUSD }) => depositedUSD + acc,
        0
      );
      const sumDebt = cdpData.reduce((acc, { debt }) => debt + acc, 0);
      const cleanedCDP = cdpData.map(cdp => {
        return Object.keys(cdp)
          .map(k => {
            switch (k) {
              case 'deposited':
                return `${cdp[k].toFixed(2)} ${cdp['token']}`;
              case 'withdraw':
                return `${cdp[k].toFixed(2)} ${cdp['token']}`;
              case 'debt':
                return `${cdp[k].toFixed(2)} DAI`;
              case 'depositedUSD':
                return null;
              default:
                return cdp[k];
            }
          })
          .filter(e => e !== null);
      });
      setTotalCollateralUSD(round(sumDeposits, 2).toFixed(2));
      setTotalDaiDebt(sumDebt.toFixed(2));
      setCdpContent(cleanedCDP);
    } catch (e) {
      return null;
    }
  };

  return (
    <PageContentLayout>
      <Text.h2 pr="m" mb="m" color="darkPurple">
        {lang.overview_page.title}
      </Text.h2>
      {cdpContent && (
        <Grid gridRowGap={{ s: 'm', m: 'l' }}>
          <Grid
            gridTemplateColumns={{ s: '1fr', m: 'auto auto 1fr' }}
            gridColumnGap="m"
            gridRowGap="s"
          >
            <InfoCard
              title={lang.overview_page.total_collateral_locked}
              amount={`$${totalCollateralUSD}`}
              denom={'USD'}
            />
            <InfoCard
              title={lang.overview_page.total_dai_debt}
              amount={totalDaiDebt}
              denom={'DAI'}
            />
          </Grid>
          <Box>
            <Text.h4>{lang.overview_page.your_cdps}</Text.h4>
            <Card
              px={{ s: 'm', m: 'l' }}
              pt="m"
              pb="s"
              my="m"
              css={`
                overflow-x: scroll;
              `}
            >
              <Table
                width="100%"
                variant="cozy"
                css={`
                  td,
                  th {
                    white-space: nowrap;
                  }
                  td:not(:last-child),
                  th:not(:last-child) {
                    padding-right: 10px;
                  }
                `}
              >
                <Table.thead>
                  <Table.tr>
                    <Table.th>{lang.overview_page.token}</Table.th>
                    <Table.th>{lang.overview_page.id}</Table.th>
                    <Table.th display={{ s: 'table-cell', m: 'none' }}>
                      {lang.overview_page.ratio_mobile}
                    </Table.th>
                    <Table.th display={{ s: 'none', m: 'table-cell' }}>
                      {lang.overview_page.ratio}
                    </Table.th>
                    <Table.th display={{ s: 'none', m: 'table-cell' }}>
                      {lang.overview_page.deposited}
                    </Table.th>
                    <Table.th display={{ s: 'none', m: 'table-cell' }}>
                      {lang.overview_page.withdraw}
                    </Table.th>
                    <Table.th display={{ s: 'none', m: 'table-cell' }}>
                      {lang.overview_page.debt}
                    </Table.th>
                    <Table.th />
                  </Table.tr>
                </Table.thead>
                <tbody>
                  {cdpContent.map(
                    ([token, id, ratio, deposited, withdraw, debt], i) => (
                      <Table.tr key={i}>
                        <Table.td>
                          <Text
                            t="body"
                            fontSize={{ s: '1.7rem', m: 'm' }}
                            fontWeight={{ s: 'medium', m: 'normal' }}
                            color="darkPurple"
                          >
                            {token}
                          </Text>
                        </Table.td>
                        <Table.td>
                          <Text
                            t="body"
                            fontSize={{ s: '1.7rem', m: 'm' }}
                            color={{ s: 'darkLavender', m: 'darkPurple' }}
                          >
                            {id}
                          </Text>
                        </Table.td>
                        <Table.td>
                          {isFinite(ratio) ? (
                            <RatioDisplay
                              fontSize={{ s: '1.7rem', m: '1.3rem' }}
                              ratio={ratio}
                              inverse={true}
                            />
                          ) : (
                            <Text fontSize={{ s: '1.7rem', m: '1.3rem' }}>
                              N/A
                            </Text>
                          )}
                        </Table.td>
                        <Table.td display={{ s: 'none', m: 'table-cell' }}>
                          <Text t="caption" color="darkLavender">
                            {deposited}
                          </Text>
                        </Table.td>
                        <Table.td display={{ s: 'none', m: 'table-cell' }}>
                          <Text t="caption" color="darkLavender">
                            {withdraw}
                          </Text>
                        </Table.td>
                        <Table.td display={{ s: 'none', m: 'table-cell' }}>
                          <Text t="caption" color="darkLavender">
                            {debt}
                          </Text>
                        </Table.td>
                        <Table.td>
                          <Flex justifyContent="flex-end">
                            <Button
                              variant="secondary-outline"
                              px="s"
                              py="2xs"
                              borderColor="steel"
                            >
                              <Link
                                href={`/${id}${url.search}`}
                                prefetch={true}
                              >
                                <Text
                                  fontSize="1.3rem"
                                  color="steel"
                                  css={`
                                    white-space: nowrap;
                                  `}
                                >
                                  <Box display={{ s: 'none', m: 'inline' }}>
                                    {lang.overview_page.view_cdp}
                                  </Box>
                                  <Box display={{ s: 'inline', m: 'none' }}>
                                    {lang.overview_page.view_cdp_mobile}
                                  </Box>
                                </Text>
                              </Link>
                            </Button>
                          </Flex>
                        </Table.td>
                      </Table.tr>
                    )
                  )}
                </tbody>
              </Table>
            </Card>
          </Box>
        </Grid>
      )}
    </PageContentLayout>
  );
}

export default hot(Overview);
