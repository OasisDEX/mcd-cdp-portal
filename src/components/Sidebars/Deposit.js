import React, { useState, useEffect } from 'react';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
import Info from './shared/Info';
import useMaker from '../../hooks/useMaker';
import { getUsdPrice, calcCDPParams } from '../../utils/cdp';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice
} from '../../utils/ui';

const Deposit = ({ cdp, reset }) => {
  const { maker } = useMaker();
  const [amount, setAmount] = useState('');
  const [gemBalance, setGemBalance] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  maker
    .getToken(cdp.ilkData.gem)
    .balance()
    .then(balance => {
      setGemBalance(balance.toNumber());
    });

  const priceFeed = getUsdPrice(cdp.ilkData);

  useEffect(() => {
    let val = parseFloat(amount);
    val = isNaN(val) ? 0 : val;
    const { liquidationPrice, collateralizationRatio } = calcCDPParams({
      ilkData: cdp.ilkData,
      gemsToLock: cdp.collateral.toNumber() + val,
      daiToDraw: cdp.debt.toNumber()
    });
    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  }, [amount]);

  const setMax = () => {
    setAmount(gemBalance);
  };

  const lessThanBalance = amount === '' || parseFloat(amount) <= gemBalance;
  const inputNotEmpty = amount !== '';
  const valid = inputNotEmpty && lessThanBalance;

  return (
    <SidebarActionLayout onClose={reset}>
      <Grid gridRowGap="l">
        <Grid gridRowGap="s">
          <h3>Deposit {cdp.ilkData.gem}</h3>
          <p>
            <Text t="body">How much {cdp.ilk} would you like to deposit?</Text>
          </p>
          <Input
            type="number"
            min="0"
            value={amount}
            onChange={evt => setAmount(evt.target.value)}
            placeholder={`0.00 ${cdp.ilkData.gem}`}
            after={
              <Link fontWeight="medium" onClick={setMax}>
                Set max
              </Link>
            }
            errorMessage={
              lessThanBalance ? null : 'Amount must be less than balance'
            }
          />
        </Grid>
        <Info
          title="Current account balance"
          body={`${gemBalance.toFixed(6)} ${cdp.ilkData.gem}`}
        />
        <Info
          title={`${cdp.ilkData.gem}/USD price feed`}
          body={`${priceFeed} ${cdp.ilkData.gem}/USD`}
        />
        <Info
          title="New liquidation price"
          body={formatLiquidationPrice(liquidationPrice, cdp.ilkData)}
        />
        <Info
          title="New collateralization ratio"
          body={formatCollateralizationRatio(collateralizationRatio)}
        />
        <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s" mt="s">
          <Button disabled={!valid}>Deposit</Button>
          <Button variant="secondary-outline" onClick={reset}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </SidebarActionLayout>
  );
};
export default Deposit;
