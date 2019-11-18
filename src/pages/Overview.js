import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import PageContentLayout from 'layouts/PageContentLayout';
import LoadingLayout from 'layouts/LoadingLayout';
import {
  Text,
  Grid,
  Card,
  Table,
  Box,
  Button,
  Address,
  Flex
} from '@makerdao/ui-components-core';
import { Link, useCurrentRoute } from 'react-navi';
import useMaker from 'hooks/useMaker';
import round from 'lodash/round';
import RatioDisplay from '../components/RatioDisplay';
import { getColor } from 'styles/theme';
import useStore from 'hooks/useStore';
import useLanguage from 'hooks/useLanguage';
import {
  getCdp,
  getDebtAmount,
  getCollateralAmount,
  getCollateralValueUSD,
  getCollateralizationRatio,
  getCollateralAvailableAmount
} from 'reducers/cdps';
import { Routes } from '../utils/constants';
import useModal from '../hooks/useModal';
import { NotificationStatus, NotificationList } from 'utils/constants';
import useNotification from 'hooks/useNotification';

const InfoCard = ({ title, amount, denom }) => (
  <Card py={{ s: 'm', xl: 'l' }} px="m" minWidth="22.4rem">
    <Grid gridRowGap="s">
      <Text
        justifySelf={{ s: 'left', xl: 'center' }}
        t="subheading"
        css={`
          white-space: nowrap;
        `}
      >
        {title.toUpperCase()}
      </Text>
      <Box justifySelf={{ s: 'left', xl: 'center' }}>
        <Box display={{ s: 'none', xl: 'unset' }}>
          <Flex alignSelf="end" alignItems="flex-end">
            <Text.h3>{amount}</Text.h3>&nbsp;<Text.h4>{denom}</Text.h4>
          </Flex>
        </Box>
        <Text.h4 display={{ s: 'unset', xl: 'none' }}>
          {amount} {denom}
        </Text.h4>
      </Box>
    </Grid>
  </Card>
);

function Overview({ viewedAddress }) {
  const { account, viewedAddressData } = useMaker();
  const [{ cdps, feeds }] = useStore();
  const [totalCollateralUSD, setTotalCollateralUSD] = useState(0);
  const [totalDaiDebt, setTotalDaiDebt] = useState(0);
  const [cdpContent, setCdpContent] = useState(null);
  const { url } = useCurrentRoute();
  const { lang } = useLanguage();

  const { addNotification, deleteNotifications } = useNotification();

  useEffect(() => {
    if (account && viewedAddress !== account.address) {
      addNotification({
        id: NotificationList.NON_OVERVIEW_OWNER,
        content: lang.formatString(
          lang.notifications.non_overview_owner,
          <Address full={viewedAddress} shorten={true} expandable={false} />
        ),
        status: NotificationStatus.WARNING
      });
    }
    return () => deleteNotifications([NotificationList.NON_OVERVIEW_OWNER]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedAddress, account]);

  useEffect(() => {
    if (viewedAddressData) {
      const cdpData = viewedAddressData.cdps.map(({ id: cdpId }) => {
        const cdp = getCdp(cdpId, { cdps, feeds });
        return {
          token: cdp.gem,
          id: cdpId,
          ratio: getCollateralizationRatio(cdp),
          ilkLiqRatio: cdp.liquidationRatio,
          deposited: getCollateralAmount(cdp),
          withdraw: getCollateralAvailableAmount(cdp),
          debt: getDebtAmount(cdp),
          depositedUSD: getCollateralValueUSD(cdp)
        };
      });
      const sumDeposits = parseFloat(
        cdpData.reduce((acc, { depositedUSD }) => depositedUSD + acc, 0)
      );
      const sumDebt = parseFloat(
        cdpData.reduce((acc, { debt }) => debt + acc, 0)
      );

      if (sumDebt) {
        setTotalDaiDebt(sumDebt.toFixed(2));
      }
      if (sumDeposits) {
        setTotalCollateralUSD(round(sumDeposits, 2).toFixed(2));
      }

      const cleanedCDP = cdpData.map(cdp => {
        return Object.keys(cdp).map(k => {
          if (!cdp[k]) return null;
          const val = parseFloat(cdp[k]).toFixed(2);
          switch (k) {
            case 'deposited':
              return `${val} ${cdp['token']}`;
            case 'withdraw':
              return `${val} ${cdp['token']}`;
            case 'debt':
              return `${val} DAI`;
            case 'depositedUSD':
              return null;
            default:
              return cdp[k];
          }
        });
      });

      setCdpContent(cleanedCDP);
    }
  }, [account, cdps, feeds, viewedAddress, viewedAddressData]);

  const { show } = useModal();
  if (!viewedAddressData) {
    return <LoadingLayout background={getColor('lightGrey')} />;
  }

  if (!viewedAddressData.cdps.length) {
    return (
      <PageContentLayout>
        <Flex
          height="70vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          {account && account.address === viewedAddressData.viewedAddress ? (
            <>
              <Text.p t="h4" mb="26px">
                {lang.overview_page.get_started_title}
              </Text.p>
              <Button
                p="s"
                css={{ cursor: 'pointer' }}
                onClick={() =>
                  show({
                    modalType: 'cdpcreate',
                    modalTemplate: 'fullscreen'
                  })
                }
              >
                {lang.actions.get_started}
              </Button>
            </>
          ) : (
            <Text.p t="h4" mb="s">
              {lang.formatString(
                lang.overview_page.no_vaults,
                <Address
                  full={viewedAddressData.viewedAddress}
                  shorten={true}
                  expandable={false}
                />
              )}
            </Text.p>
          )}
        </Flex>
      </PageContentLayout>
    );
  }

  return (
    <PageContentLayout>
      <Text.h2 pr="m" mb="m" color="darkPurple">
        {lang.overview_page.title}
      </Text.h2>
      {cdpContent && (
        <Grid gridRowGap={{ s: 'm', xl: 'l' }}>
          <Grid
            gridTemplateColumns={{ s: '1fr', xl: 'auto auto 1fr' }}
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
              px={{ s: 'm', xl: 'l' }}
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
                    <Table.th display={{ s: 'table-cell', xl: 'none' }}>
                      {lang.overview_page.ratio_mobile}
                    </Table.th>
                    <Table.th display={{ s: 'none', xl: 'table-cell' }}>
                      {lang.overview_page.ratio}
                    </Table.th>
                    <Table.th display={{ s: 'none', xl: 'table-cell' }}>
                      {lang.overview_page.deposited}
                    </Table.th>
                    <Table.th display={{ s: 'none', xl: 'table-cell' }}>
                      {lang.overview_page.withdraw}
                    </Table.th>
                    <Table.th display={{ s: 'none', xl: 'table-cell' }}>
                      {lang.overview_page.debt}
                    </Table.th>
                    <Table.th />
                  </Table.tr>
                </Table.thead>
                <tbody>
                  {cdpContent.map(
                    (
                      [
                        token,
                        id,
                        ratio,
                        ilkLiqRatio,
                        deposited,
                        withdraw,
                        debt
                      ],
                      i
                    ) => {
                      return (
                        <Table.tr key={i}>
                          <Table.td>
                            <Text
                              t="body"
                              fontSize={{ s: '1.7rem', xl: 'm' }}
                              fontWeight={{ s: 'medium', xl: 'normal' }}
                              color="darkPurple"
                            >
                              {token}
                            </Text>
                          </Table.td>
                          <Table.td>
                            <Text
                              t="body"
                              fontSize={{ s: '1.7rem', xl: 'm' }}
                              color={{ s: 'darkLavender', xl: 'darkPurple' }}
                            >
                              {id}
                            </Text>
                          </Table.td>
                          <Table.td>
                            {isFinite(ratio) ? (
                              <RatioDisplay
                                fontSize={{ s: '1.7rem', xl: '1.3rem' }}
                                ratio={ratio}
                                ilkLiqRatio={ilkLiqRatio}
                              />
                            ) : (
                              <Text fontSize={{ s: '1.7rem', xl: '1.3rem' }}>
                                N/A
                              </Text>
                            )}
                          </Table.td>
                          <Table.td display={{ s: 'none', xl: 'table-cell' }}>
                            <Text t="caption" color="darkLavender">
                              {deposited}
                            </Text>
                          </Table.td>
                          <Table.td display={{ s: 'none', xl: 'table-cell' }}>
                            <Text t="caption" color="darkLavender">
                              {withdraw}
                            </Text>
                          </Table.td>
                          <Table.td display={{ s: 'none', xl: 'table-cell' }}>
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
                                  href={`/${Routes.BORROW}/${id}${url.search}`}
                                  prefetch={true}
                                >
                                  <Text
                                    fontSize="1.3rem"
                                    color="steel"
                                    css={`
                                      white-space: nowrap;
                                    `}
                                  >
                                    <Box display={{ s: 'none', xl: 'inline' }}>
                                      {lang.overview_page.view_cdp}
                                    </Box>
                                    <Box display={{ s: 'inline', xl: 'none' }}>
                                      {lang.overview_page.view_cdp_mobile}
                                    </Box>
                                  </Text>
                                </Link>
                              </Button>
                            </Flex>
                          </Table.td>
                        </Table.tr>
                      );
                    }
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
