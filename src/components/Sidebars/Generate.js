import React, { useState, useEffect } from 'react';
import { Text, Input, Grid, Button, Link } from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import { calcCDPParams } from '../../utils/cdp';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice
} from '../../utils/ui';
import lang from 'languages';
import useMaker from '../../hooks/useMaker';

const Generate = ({ cdp, reset }) => {
  const { maker, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');
  const [daiAvailable, setDaiAvailable] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  useEffect(() => {
    const amountToGenerate = parseFloat(amount || 0);
    const {
      liquidationPrice,
      collateralizationRatio,
      daiAvailable
    } = calcCDPParams({
      ilkData: cdp.ilkData,
      gemsToLock: cdp.collateral.toNumber(),
      daiToDraw: cdp.debt.toNumber() + amountToGenerate
    });

    setDaiAvailable(daiAvailable - cdp.debt.toNumber());
    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  }, [amount]);

  const undercollateralized =
    collateralizationRatio < cdp.ilkData.liquidationRatio;
  const valid = parseFloat(amount) >= 0 && !undercollateralized;

  const setMax = () => {
    setAmount(daiAvailable);
  };

  const generate = async () => {
    const managedCdp = await maker.service('mcd:cdpManager').getCdp(cdp.id);
    newTxListener(managedCdp.drawDai(parseFloat(amount)), 'Drawing DAI');
    reset();
  };

  return (
    <SidebarActionLayout onClose={reset}>
      <Grid gridRowGap="m">
        <Grid gridRowGap="s">
          <Text.h4 color="darkLavender">
            {lang.action_sidebar.generate_title}
          </Text.h4>
          <Text.p t="body">{lang.action_sidebar.generate_description}</Text.p>
          <Input
            type="number"
            value={amount}
            min="0"
            onChange={evt => setAmount(evt.target.value)}
            placeholder="0.00 DAI"
            errorMessage={
              undercollateralized
                ? lang.action_sidebar.cdp_below_threshold
                : null
            }
            after={
              <Link fontWeight="medium" onClick={setMax}>
                {lang.action_sidebar.set_max}
              </Link>
            }
          />
        </Grid>
        <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
          <Button onClick={generate} disabled={!valid}>
            {lang.actions.generate}
          </Button>
          <Button variant="secondary-outline" onClick={reset}>
            {lang.cancel}
          </Button>
        </Grid>
        <InfoContainer>
          <Info
            title={lang.action_sidebar.maximum_available_to_generate}
            body={`${daiAvailable.toFixed(6)} DAI`}
          />
          <Info
            title={lang.action_sidebar.new_liquidation_price}
            body={formatLiquidationPrice(liquidationPrice, cdp.ilkData)}
          />
          <Info
            title={lang.action_sidebar.new_collateralization_ratio}
            body={
              <Text color={undercollateralized ? 'linkOrange' : null}>
                {formatCollateralizationRatio(collateralizationRatio)}
              </Text>
            }
          />
        </InfoContainer>
      </Grid>
    </SidebarActionLayout>
  );
};
export default Generate;
