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
import InfoContainer from './shared/InfoContainer';
import lang from 'languages';

const Payback = ({ cdp, reset }) => {
  const { maker, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');
  const [daiBalance, setDaiBalance] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  maker
    .getToken('MDAI')
    .balance()
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
    setAmount(Math.min(cdp.debt.toNumber(), daiBalance));
  };

  const payback = async () => {
    const managedCdp = await maker.service('mcd:cdpManager').getCdp(cdp.id);
    newTxListener(managedCdp.wipeDai(parseFloat(amount)), 'Paying Back DAI');
    reset();
  };

  const amt = parseFloat(amount);
  const isLessThanBalance = amt <= daiBalance;
  const isLessThanDebt = amt <= cdp.debt.toNumber();
  const isNonZero = amount !== '' && amt > 0;
  const valid = isNonZero && isLessThanDebt && isLessThanBalance;

  let errorMessage = null;
  if (!isLessThanBalance && isNonZero)
    errorMessage = lang.formatString(
      lang.action_sidebar.insufficient_balance,
      'DAI'
    );
  if (!isLessThanDebt && isNonZero)
    errorMessage = lang.action_sidebar.cannot_payback_more_than_owed;

  return (
    <SidebarActionLayout onClose={reset}>
      <Grid gridRowGap="m">
        <Grid gridRowGap="s">
          <Text.h4 color="darkLavender">
            {lang.action_sidebar.payback_title}
          </Text.h4>
          <Text.p t="body">{lang.action_sidebar.payback_description}</Text.p>
          <Input
            type="number"
            value={amount}
            min="0"
            onChange={evt => setAmount(evt.target.value)}
            placeholder="0.00 DAI"
            errorMessage={errorMessage}
            after={
              <Link onClick={setMax} fontWeight="medium">
                {lang.action_sidebar.set_max}
              </Link>
            }
          />
        </Grid>
        <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
          <Button disabled={!valid} onClick={payback}>
            {lang.actions.pay_back}
          </Button>
          <Button variant="secondary-outline" onClick={reset}>
            {lang.cancel}
          </Button>
        </Grid>
        <InfoContainer>
          <Info
            title={lang.action_sidebar.dai_balance}
            body={`${daiBalance && daiBalance.toFixed(6)} DAI`}
          />
          <Info
            title={lang.action_sidebar.dai_debt}
            body={`${cdp.debt && cdp.debt.toNumber().toFixed(2)} DAI`}
          />
          <Info
            title={lang.action_sidebar.new_liquidation_price}
            body={formatLiquidationPrice(liquidationPrice, cdp.ilkData)}
          />
          <Info
            title={lang.action_sidebar.new_collateralization_ratio}
            body={formatCollateralizationRatio(collateralizationRatio)}
          />
        </InfoContainer>
      </Grid>
    </SidebarActionLayout>
  );
};
export default Payback;
