import React, { useState, useEffect } from 'react';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from '../../hooks/useMaker';
import {
  calcCDPParams,
  getLockedAndFreeCollateral,
  getUsdPrice
} from '../../utils/cdp';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice
} from '../../utils/ui';
import lang from 'languages';

const Withdraw = ({ cdp, reset }) => {
  const { newTxListener } = useMaker();
  const [amount, setAmount] = useState('');
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  const collateralPrice = getUsdPrice(cdp.ilkData);
  const { free: freeCollateral } = getLockedAndFreeCollateral(cdp);
  const { symbol } = cdp.type.currency;

  useEffect(() => {
    let val = parseFloat(amount);
    val = isNaN(val) ? 0 : val;
    const { liquidationPrice, collateralizationRatio } = calcCDPParams({
      ilkData: cdp.ilkData,
      gemsToLock: cdp.collateral.toNumber() - val,
      daiToDraw: cdp.debt.toNumber()
    });
    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  }, [amount, cdp.collateral, cdp.debt, cdp.ilkData]);

  const setMax = () => setAmount(freeCollateral);
  const lessThanMax = amount === '' || parseFloat(amount) <= freeCollateral;
  const moreThanZero = amount !== '' && amount > 0;
  const valid = moreThanZero && lessThanMax;

  const withdraw = async () => {
    newTxListener(
      cdp.freeCollateral(parseFloat(amount)),
      `Withdrawing ${symbol}`
    );
    reset();
  };

  return (
    <SidebarActionLayout onClose={reset}>
      <Grid gridRowGap="m">
        <Grid gridRowGap="s">
          <Text.h4 color="darkLavender">
            {lang.formatString(lang.action_sidebar.withdraw_title, symbol)}
          </Text.h4>
          <Text.p t="body">
            {lang.formatString(
              lang.action_sidebar.withdraw_description,
              symbol
            )}
          </Text.p>
          <Input
            type="number"
            placeholder={`0.00 ${cdp.ilk}`}
            value={amount}
            min="0"
            onChange={evt => setAmount(evt.target.value)}
            after={
              <Link fontWeight="medium" onClick={setMax}>
                {lang.action_sidebar.set_max}
              </Link>
            }
            errorMessage={
              lessThanMax ? null : lang.action_sidebar.cdp_below_threshold
            }
          />
        </Grid>
        <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
          <Button disabled={!valid} onClick={withdraw}>
            {lang.actions.withdraw}
          </Button>
          <Button variant="secondary-outline" onClick={reset}>
            {lang.cancel}
          </Button>
        </Grid>
        <InfoContainer>
          <Info
            title={lang.action_sidebar.maximum_available_to_withdraw}
            body={`${freeCollateral.toFixed(6)} ${symbol}`}
          />
          <Info
            title={lang.formatString(
              lang.action_sidebar.gem_usd_price_feed,
              symbol
            )}
            body={`${collateralPrice} ${symbol}/USD`}
          />
          <Info
            title={lang.action_sidebar.new_liquidation_price}
            body={formatLiquidationPrice(liquidationPrice, cdp.ilkData)}
          />
          <Info
            title={lang.action_sidebar.new_collateralization_ratio}
            body={
              <Text color={lessThanMax ? null : 'linkOrange'}>
                {formatCollateralizationRatio(collateralizationRatio)}
              </Text>
            }
          />
        </InfoContainer>
      </Grid>
    </SidebarActionLayout>
  );
};
export default Withdraw;
