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
import lang from 'languages';

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

  const deposit = async () => {
    const managedCdp = await maker.service('mcd:cdpManager').getCdp(cdp.id);
    managedCdp.lockCollateral(parseFloat(amount));
    reset();
  };

  const lessThanBalance = amount === '' || parseFloat(amount) <= gemBalance;
  const inputNotEmpty = amount !== '';
  const valid = inputNotEmpty && lessThanBalance;

  return (
    <SidebarActionLayout onClose={reset}>
      <Grid gridRowGap="l">
        <Grid gridRowGap="s">
          <h3>
            {lang.formatString(
              lang.action_sidebar.deposit_title,
              cdp.ilkData.gem
            )}
          </h3>
          <p>
            <Text t="body">
              {lang.formatString(
                lang.action_sidebar.deposit_description,
                cdp.ilkData.gem
              )}
            </Text>
          </p>
          <Input
            type="number"
            min="0"
            value={amount}
            onChange={evt => setAmount(evt.target.value)}
            placeholder={`0.00 ${cdp.ilkData.gem}`}
            after={
              <Link fontWeight="medium" onClick={setMax}>
                {lang.action_sidebar.set_max}
              </Link>
            }
            errorMessage={
              lessThanBalance
                ? null
                : lang.formatString(
                    lang.action_sidebar.insufficient_balance,
                    cdp.ilkData.gem
                  )
            }
          />
        </Grid>
        <Info
          title={lang.action_sidebar.current_account_balance}
          body={`${gemBalance.toFixed(6)} ${cdp.ilkData.gem}`}
        />
        <Info
          title={lang.formatString(
            lang.action_sidebar.gem_usd_price_feed,
            cdp.ilkData.gem
          )}
          body={`${priceFeed} ${cdp.ilkData.gem}/USD`}
        />
        <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={formatLiquidationPrice(liquidationPrice, cdp.ilkData)}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={formatCollateralizationRatio(collateralizationRatio)}
        />
        <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s" mt="s">
          <Button onClick={deposit} disabled={!valid}>
            {lang.actions.deposit}
          </Button>
          <Button variant="secondary-outline" onClick={reset}>
            {lang.cancel}
          </Button>
        </Grid>
      </Grid>
    </SidebarActionLayout>
  );
};
export default Deposit;
