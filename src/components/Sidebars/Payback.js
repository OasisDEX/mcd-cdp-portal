import React, { useState, useEffect } from 'react';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
import useMaker from '../../hooks/useMaker';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice
} from '../../utils/ui';
import { calcCDPParams } from '../../utils/cdp';
import Info from './shared/Info';

const Payback = ({ cdp, reset }) => {
  const { maker } = useMaker();
  const [amount, setAmount] = useState('');
  const [daiBalance, setDaiBalance] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  maker
    .getToken('MDAI')
    .balanceOf(maker.currentAddress())
    .then(daiBalance => {
      setDaiBalance(daiBalance.toNumber());
    });

  useEffect(() => {
    const amountToPayback = parseFloat(amount || 0);
    const { liquidationPrice, collateralizationRatio } = calcCDPParams({
      ilkData: cdp.ilkData,
      gemsToLock: cdp.collateral.toNumber(),
      daiToDraw: Math.max(cdp.debt.toNumber() - amountToPayback, 0)
    });

    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  }, [amount]);

  const setMax = () => {
    setAmount(cdp.debt.toNumber());
  };

  const payback = async () => {
    const managedCdp = await maker.service('mcd:cdpManager').getCdp(cdp.id);
    managedCdp.wipeDai(parseFloat(amount));
    reset();
  };

  const amt = parseFloat(amount);
  const isLessThanBalance = amt <= daiBalance;
  const isLessThanDebt = amt <= cdp.debt.toNumber();
  const isNonZero = amount !== 0 && amt > 0;
  const valid = isNonZero && isLessThanDebt && isLessThanBalance;

  let errorMessage = null;
  if (!isLessThanBalance && isNonZero) errorMessage = 'Insufficient balance';
  if (!isLessThanDebt && isNonZero)
    errorMessage = 'Cannot payback more than owed';

  return (
    <SidebarActionLayout onClose={reset}>
      <Grid gridRowGap="l">
        <Grid gridRowGap="s">
          <h3>Payback DAI</h3>
          <p>
            <Text color="text" t="body">
              How much DAI would you like to payback?
            </Text>
          </p>
          <Input
            type="number"
            value={amount}
            min="0"
            onChange={evt => setAmount(evt.target.value)}
            placeholder="0.00 DAI"
            errorMessage={errorMessage}
            after={
              <div>
                <Link onClick={setMax} fontWeight="medium">
                  Set max
                </Link>
              </div>
            }
          />
        </Grid>
        <Info
          title="Dai balance"
          body={`${daiBalance && daiBalance.toFixed(6)} DAI`}
        />
        <Info
          title="Dai debt"
          body={`${cdp.debt && cdp.debt.toNumber().toFixed(2)} DAI`}
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
          <Button disabled={!valid} onClick={payback}>
            Payback
          </Button>
          <Button variant="secondary-outline" onClick={reset}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </SidebarActionLayout>
  );
};
export default Payback;
