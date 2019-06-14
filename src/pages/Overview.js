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
import { getColor } from 'styles/theme';
import { Link, useCurrentRoute } from 'react-navi';
import useMaker from 'hooks/useMaker';
import round from 'lodash/round';
import RatioDisplay from '../components/RatioDisplay';
import styled from 'styled-components';
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
  <Card py="l" px="m" minWidth="22.4rem">
    <Grid gridRowGap="s">
      <Text
        justifySelf="center"
        t="subheading"
        textAlign="center"
        css={`
          white-space: nowrap;
        `}
      >
        {title.toUpperCase()}
      </Text>
      <Flex justifySelf="center" alignSelf="end" alignItems="flex-end">
        <Text.h3>{amount}</Text.h3>&nbsp;<Text.h4>{denom}</Text.h4>
      </Flex>
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
      console.log(cdpData);
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
        <Box>
          <Grid
            gridTemplateColumns={{ s: '1fr 1fr', m: 'auto auto 1fr' }}
            gridColumnGap="m"
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
          <Box my="l">
            <Text.h4>{lang.overview_page.your_cdps}</Text.h4>
            <Card
              px="l"
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
                tableLayout="fixed"
                css={`
                  td,
                  th {
                    padding-right: 10px;
                  }
                `}
              >
                <Table.thead>
                  <Table.tr>
                    {[
                      'token',
                      'id',
                      'ratio',
                      'deposited',
                      'withdraw',
                      'debt'
                    ].map((k, i) => (
                      <Table.th
                        key={i}
                        css={`
                          white-space: nowrap;
                        `}
                      >
                        {lang.overview_page[k]}
                      </Table.th>
                    ))}
                  </Table.tr>
                </Table.thead>
                <tbody>
                  {cdpContent.map(
                    ([token, id, ratio, deposited, withdraw, debt], i) => (
                      <tr
                        key={i}
                        css={`
                          white-space: nowrap;
                        `}
                      >
                        <td>
                          <Text t="body" color="darkPurple">
                            {token}
                          </Text>
                        </td>
                        <td>
                          <Text t="body" color="darkPurple">
                            {id}
                          </Text>
                        </td>
                        <td>
                          {isFinite(ratio) ? (
                            <RatioDisplay
                              fontSize="1.3rem"
                              ratio={ratio}
                              inverse={true}
                            />
                          ) : (
                            <Text fontSize="1.3rem">N/A</Text>
                          )}
                        </td>
                        <td>
                          <Text t="caption" color="darkLavender">
                            {deposited}
                          </Text>
                        </td>
                        <td>
                          <Text t="caption" color="darkLavender">
                            {withdraw}
                          </Text>
                        </td>
                        <td>
                          <Text t="caption" color="darkLavender">
                            {debt}
                          </Text>
                        </td>
                        <td>
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
                                  {lang.overview_page.view_cdp}
                                </Text>
                              </Link>
                            </Button>
                          </Flex>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </Card>
          </Box>
        </Box>
      )}
    </PageContentLayout>
  );
}

export default hot(Overview);
