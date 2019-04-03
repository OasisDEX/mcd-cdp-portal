import React, { useState, useEffect } from 'react';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
import Info from './shared/Info';
import {
  calcCDPParams,
  getLockedAndFreeCollateral,
  getUsdPrice
} from '../../utils/cdp';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice
} from '../../utils/ui';

const Withdraw = ({ cdp, reset }) => {
  const [amount, setAmount] = useState('');
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  const collateralPrice = getUsdPrice(cdp.ilkData);
  const { free: freeCollateral } = getLockedAndFreeCollateral(cdp);

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
  }, [amount]);

  const setMax = () => {
    setAmount(freeCollateral);
  };

  const lessThanMax = amount === '' || parseFloat(amount) <= freeCollateral;
  const moreThanZero = amount !== '' && amount > 0;
  const valid = moreThanZero && lessThanMax;

  return (
    <SidebarActionLayout onClose={reset}>
      <Grid gridRowGap="l">
        <Grid gridRowGap="s">
          <h3>Withdraw {cdp.ilkData.gem}</h3>
          <p>
            <Text t="body">
              How much {cdp.ilkData.gem} would you like to withdraw?
            </Text>
          </p>
          <Input
            type="number"
            placeholder={`0.00 ${cdp.ilk}`}
            value={amount}
            min="0"
            onChange={evt => setAmount(evt.target.value)}
            after={
              <Link fontWeight="medium" onClick={setMax}>
                Set max
              </Link>
            }
            errorMessage={
              lessThanMax ? null : 'Cannot withdraw more than available'
            }
          />
        </Grid>
        <Info
          title="Maximum available to withdraw"
          body={`${freeCollateral.toFixed(6)} ${cdp.ilkData.gem}`}
        />
        <Info
          title="ETH/USD price feed"
          body={`${collateralPrice} ${cdp.ilkData.gem}/USD`}
        />
        <Info
          title="New liquidation price"
          body={formatLiquidationPrice(liquidationPrice, cdp.ilkData)}
        />
        <Info
          title="New collateralization ratio"
          body={
            <Text color={lessThanMax ? null : 'linkOrange'}>
              {formatCollateralizationRatio(collateralizationRatio)}
            </Text>
          }
        />
        <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s" mt="s">
          <Button disabled={!valid}>Withdraw</Button>
          <Button variant="secondary-outline" onClick={reset}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </SidebarActionLayout>
  );
};
export default Withdraw;
