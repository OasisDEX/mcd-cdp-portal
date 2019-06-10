import React, { useState, useEffect } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from '../../hooks/useMaker';
import { calcCDPParams } from '../../utils/cdp';
import useStore from 'hooks/useStore';
import {
  getCdp,
  getDebtAmount,
  getCollateralAmount,
  getCollateralPrice,
  getCollateralAvailableAmount
} from 'reducers/cdps';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice
} from '../../utils/ui';
import lang from 'languages';

const Withdraw = ({ cdpId, reset }) => {
  const { maker, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);

  const collateralAvailableAmount = getCollateralAvailableAmount(cdp, true, 9);
  const collateralPrice = getCollateralPrice(cdp);
  const collateralAmount = getCollateralAmount(cdp, true, 9);
  const debtAmount = getDebtAmount(cdp);

  const { symbol } = cdp.currency;

  useEffect(() => {
    let val = parseFloat(amount);
    val = isNaN(val) ? 0 : val;
    const { liquidationPrice, collateralizationRatio } = calcCDPParams({
      ilkData: cdp,
      gemsToLock: collateralAmount - val,
      daiToDraw: debtAmount
    });
    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  }, [amount, cdp]);

  const setMax = () => setAmount(collateralAvailableAmount.toFixed(9));
  const lessThanMax =
    amount === '' || parseFloat(amount) <= collateralAvailableAmount;
  const moreThanZero = amount !== '' && amount > 0;
  const valid = moreThanZero && lessThanMax;

  const withdraw = () => {
    newTxListener(
      maker
        .service('mcd:cdpManager')
        .wipeAndFree(cdpId, cdp.ilk, MDAI(0), cdp.currency(parseFloat(amount))),
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
            placeholder={`0.00 ${symbol}`}
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
            body={`${collateralAvailableAmount} ${symbol}`}
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
            body={formatLiquidationPrice(liquidationPrice, cdp.currency.symbol)}
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
