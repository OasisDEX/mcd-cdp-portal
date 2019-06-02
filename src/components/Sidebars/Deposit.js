import React, { useState, useEffect } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from '../../hooks/useMaker';
import useStore from 'hooks/useStore';
import {
  getCdp,
  getDebtAmount,
  getCollateralPrice,
  getCollateralAmount
} from 'reducers/cdps';
import { calcCDPParams } from '../../utils/cdp';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice
} from '../../utils/ui';
import lang from 'languages';

const Deposit = ({ cdpId, reset }) => {
  const { maker, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');
  const [gemBalance, setGemBalance] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);

  const collateralPrice = getCollateralPrice(cdp);
  const collateralAmount = getCollateralAmount(cdp);
  const debtAmount = getDebtAmount(cdp);

  const { symbol } = cdp.currency;

  maker
    .getToken(symbol)
    .balance()
    .then(balance => {
      setGemBalance(balance.toNumber());
    });

  useEffect(() => {
    let val = parseFloat(amount);
    val = isNaN(val) ? 0 : val;
    const { liquidationPrice, collateralizationRatio } = calcCDPParams({
      ilkData: cdp,
      gemsToLock: collateralAmount + val,
      daiToDraw: debtAmount
    });
    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  }, [amount, cdp]);

  const deposit = () => {
    newTxListener(
      maker
        .service('mcd:cdpManager')
        .lockAndDraw(cdpId, cdp.ilk, cdp.currency(parseFloat(amount)), MDAI(0)),
      `Locking ${symbol}`
    );
    reset();
  };

  const setMax = () => setAmount(gemBalance);
  const lessThanBalance = amount === '' || parseFloat(amount) <= gemBalance;
  const inputNotEmpty = amount !== '';
  const valid = inputNotEmpty && lessThanBalance;

  return (
    <SidebarActionLayout onClose={reset}>
      <Grid gridRowGap="m">
        <Grid gridRowGap="s">
          <Text color="darkLavender" t="h4">
            {lang.formatString(lang.action_sidebar.deposit_title, symbol)}
          </Text>
          <p>
            <Text t="body">
              {lang.formatString(
                lang.action_sidebar.deposit_description,
                symbol
              )}
            </Text>
          </p>
          <Input
            type="number"
            min="0"
            value={amount}
            onChange={evt => setAmount(evt.target.value)}
            placeholder={`0.00 ${symbol}`}
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
                    symbol
                  )
            }
          />
        </Grid>
        <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
          <Button onClick={deposit} disabled={!valid}>
            {lang.actions.deposit}
          </Button>
          <Button variant="secondary-outline" onClick={reset}>
            {lang.cancel}
          </Button>
        </Grid>
        <InfoContainer>
          <Info
            title={lang.action_sidebar.current_account_balance}
            body={`${gemBalance.toFixed(6)} ${symbol}`}
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
            body={formatLiquidationPrice(liquidationPrice, symbol)}
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
export default Deposit;
