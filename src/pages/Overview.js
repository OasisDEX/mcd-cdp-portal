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

const TableButton = styled(Button)`
  padding: 6px 12px 6px 12px;
  background-color: #fff;
  border: 1px solid;
  border-color: #708390;
  &:hover {
    background-color: #fff;
    border-color: #708390;
  }
`;

const InfoCard = ({ title, amount, denom }) => (
  <Card p="l">
    <Grid>
      <Text justifySelf="center" color="steel" t="p5">
        {title.toUpperCase()}
      </Text>
      <Flex my="s" justifySelf="center" alignItems="flex-end">
        <Text.h2>{amount}</Text.h2>
        &nbsp;
        <Text.h3>{denom}</Text.h3>
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
          <Grid gridTemplateColumns="1fr 1fr 1fr 1fr" gridColumnGap="s">
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
            <Text.h3>{lang.overview_page.your_cdps}</Text.h3>
            <Card px="l" pt="m" pb="l" my="s">
              <Table
                width="100%"
                variant="normal"
                tableLayout="fixed"
                css={`
                  td,
                  th {
                    padding-right: 10px;
                  }
                `}
              >
                <thead>
                  <tr>
                    {[
                      'token',
                      'id',
                      'ratio',
                      'deposited',
                      'withdraw',
                      'debt'
                    ].map((k, i) => (
                      <Table.th key={i}>{lang.overview_page[k]}</Table.th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cdpContent.map(
                    ([token, id, ratio, deposited, withdraw, debt], i) => (
                      <tr key={i}>
                        <td width="10%">{token}</td>
                        <td width="10%">{id}</td>
                        <td width="15%">
                          <RatioDisplay t="p3" ratio={ratio} inverse={true} />
                        </td>
                        <td width="15%">{deposited}</td>
                        <td width="15%">{withdraw}</td>
                        <td width="15%">{debt}</td>
                        <td width="10%">
                          <TableButton>
                            <Link href={`/${id}${url.search}`} prefetch={true}>
                              <Text t="p4" color="steel">
                                {lang.overview_page.view_cdp}
                              </Text>
                            </Link>
                          </TableButton>
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
