import React, { useState, useEffect } from 'react';
import { Text, Input, Grid, Button, Link } from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
import Info from './shared/Info';
import { calcCDPParams } from '../../utils/cdp';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice
} from '../../utils/ui';
import lang from 'languages';
import useMaker from '../../hooks/useMaker';

const Generate = ({ cdp, reset }) => {
  const { maker } = useMaker();
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
    managedCdp.drawDai(parseFloat(amount));
    reset();
  };

  return (
    <SidebarActionLayout onClose={reset}>
      <Grid gridRowGap="l">
        <Grid gridRowGap="s">
          <h3>Generate DAI</h3>
          <p>
            <Text color="text" t="body">
              How much DAI would you like to generate?
            </Text>
          </p>
          <Input
            type="number"
            value={amount}
            min="0"
            onChange={evt => setAmount(evt.target.value)}
            placeholder="0.00 DAI"
            errorMessage={
              undercollateralized ? lang.cdp_create.draw_too_much_dai : null
            }
            after={
              <Link fontWeight="medium" onClick={setMax}>
                Set max
              </Link>
            }
          />
        </Grid>
        <Info
          title="Maximum available to generate"
          body={`${daiAvailable.toFixed(6)} DAI`}
        />
        <Info
          title="New liquidation price"
          body={formatLiquidationPrice(liquidationPrice, cdp.ilkData)}
        />
        <Info
          title="New collateralization ratio"
          body={
            <Text color={undercollateralized ? 'linkOrange' : null}>
              {formatCollateralizationRatio(collateralizationRatio)}
            </Text>
          }
        />
        <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s" mt="s">
          <Button onClick={generate} disabled={!valid}>
            Generate
          </Button>
          <Button variant="secondary-outline" onClick={reset}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </SidebarActionLayout>
  );
};
export default Generate;
