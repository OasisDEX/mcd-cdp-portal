import React, { useEffect } from 'react';
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
import RatioDisplay from '../components/RatioDisplay';
import { getColor } from 'styles/theme';
import useLanguage from 'hooks/useLanguage';
import useModal from '../hooks/useModal';
import useNotification from 'hooks/useNotification';
import useAnalytics from 'hooks/useAnalytics';
import useVaults from 'hooks/useVaults';
import { NotificationList, Routes, SAFETY_LEVELS } from 'utils/constants';

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
  const { trackBtnClick } = useAnalytics('Table');
  const { account } = useMaker();
  const { viewedAddressVaults } = useVaults();
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
        level: SAFETY_LEVELS.WARNING
      });
    }
    return () => deleteNotifications([NotificationList.NON_OVERVIEW_OWNER]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedAddress, account]);

  const { show } = useModal();
  if (!viewedAddressVaults) {
    return <LoadingLayout background={getColor('lightGrey')} />;
  }

  if (viewedAddressVaults && !viewedAddressVaults.length) {
    return (
      <PageContentLayout>
        <Flex
          height="70vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          {account && account.address === viewedAddress ? (
            <>
              <Text.p t="h4" mb="26px">
                {lang.overview_page.get_started_title}
              </Text.p>
              <Button
                p="s"
                css={{ cursor: 'pointer' }}
                onClick={() => {
                  trackBtnClick('CreateFirst');
                  show({
                    modalType: 'cdpcreate',
                    modalTemplate: 'fullscreen'
                  });
                }}
              >
                {lang.actions.get_started}
              </Button>
            </>
          ) : (
            <Text.p t="h4" mb="s">
              {lang.formatString(
                lang.overview_page.no_vaults,
                <Address
                  full={viewedAddress}
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
      {viewedAddressVaults && (
        <Grid gridRowGap={{ s: 'm', xl: 'l' }}>
          <Grid
            gridTemplateColumns={{ s: '1fr', xl: 'auto auto 1fr' }}
            gridColumnGap="m"
            gridRowGap="s"
          >
            <InfoCard
              title={lang.overview_page.total_collateral_locked}
              amount={`$${viewedAddressVaults
                .reduce(
                  (acc, { collateralValue }) => collateralValue.plus(acc),
                  0
                )
                .toBigNumber()
                .toFixed(2)}`}
              denom={'USD'}
            />
            <InfoCard
              title={lang.overview_page.total_dai_debt}
              amount={`${viewedAddressVaults
                .reduce((acc, { debtValue }) => debtValue.plus(acc), 0)
                .toBigNumber()
                .toFixed(2)}`}
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
                  {viewedAddressVaults.map(
                    ({
                      id,
                      collateralizationRatio,
                      liquidationRatio,
                      collateralAmount,
                      collateralAvailableAmount,
                      debtValue
                    }) => (
                      <Table.tr key={id}>
                        <Table.td>
                          <Text
                            t="body"
                            fontSize={{ s: '1.7rem', xl: 'm' }}
                            fontWeight={{ s: 'medium', xl: 'normal' }}
                            color="darkPurple"
                          >
                            {collateralAmount.symbol}
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
                          {isFinite(collateralizationRatio.toNumber()) ? (
                            <RatioDisplay
                              fontSize={{ s: '1.7rem', xl: '1.3rem' }}
                              ratio={collateralizationRatio
                                .toBigNumber()
                                .dp(4)
                                .times(100)}
                              ilkLiqRatio={liquidationRatio
                                .toBigNumber()
                                .dp(4)
                                .times(100)}
                            />
                          ) : (
                            <Text fontSize={{ s: '1.7rem', xl: '1.3rem' }}>
                              N/A
                            </Text>
                          )}
                        </Table.td>
                        <Table.td display={{ s: 'none', xl: 'table-cell' }}>
                          <Text t="caption" color="darkLavender">
                            {collateralAmount.toString()}
                          </Text>
                        </Table.td>
                        <Table.td display={{ s: 'none', xl: 'table-cell' }}>
                          <Text t="caption" color="darkLavender">
                            {collateralAvailableAmount.toString()}
                          </Text>
                        </Table.td>
                        <Table.td display={{ s: 'none', xl: 'table-cell' }}>
                          <Text t="caption" color="darkLavender">
                            {debtValue.toBigNumber().toFixed(2)} DAI
                          </Text>
                        </Table.td>
                        <Table.td>
                          <Flex justifyContent="flex-end">
                            <Button
                              variant="secondary-outline"
                              px="s"
                              py="2xs"
                              borderColor="steel"
                              onClick={() => {
                                trackBtnClick('Manage', {
                                  collateral: collateralAmount.symbol,
                                  vaultId: id
                                });
                              }}
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
