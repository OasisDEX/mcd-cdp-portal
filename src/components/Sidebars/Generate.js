import React, { useState } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button, Link } from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useStore from 'hooks/useStore';
import getCdpData from '../../reducers/selectors/getCdpData';
import { calcCDPParams, getCurrency } from '../../utils/cdp';
import { formatValue } from '../../utils/ui';
import lang from 'languages';
import useMaker from '../../hooks/useMaker';
import round from 'lodash/round';

const Generate = ({ cdpId, reset }) => {
  const { maker, newTxListener } = useMaker();
  const [amount, setAmount] = useState(0);
  const [storeState] = useStore();
  const cdp = getCdpData(cdpId, storeState);
  const {
    ilk: { name: ilkName, price, liquidationRatio },
    collateralAmount,
    daiAvailable,
    debtValue
  } = cdp;
  const max = round(daiAvailable.toNumber(), 2);

  const [liquidationPrice, setLiquidationPrice] = useState(
    cdp.liquidationPrice
  );
  const [collateralizationRatio, setCollateralizationRatio] = useState(
    cdp.collateralizationRatio
  );

  const updateAmount = value => {
    const newAmount = Math.min(value, max);
    const { liquidationPrice, collateralizationRatio } = calcCDPParams({
      liquidationRatio,
      price,
      gemsToLock: collateralAmount,
      daiToDraw: debtValue.plus(newAmount || 0)
    });

    setAmount(newAmount);
    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  };

  const undercollateralized =
    collateralizationRatio && liquidationRatio.gt(collateralizationRatio);
  const valid = parseFloat(amount) >= 0 && !undercollateralized;

  const generate = async () => {
    const currency = getCurrency(cdp);
    newTxListener(
      maker
        .service('mcd:cdpManager')
        .lockAndDraw(cdpId, ilkName, currency(0), MDAI(parseFloat(amount))),
      'Drawing DAI'
    );
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
            onChange={evt => updateAmount(evt.target.value)}
            placeholder="0.00 DAI"
            errorMessage={
              undercollateralized
                ? lang.action_sidebar.cdp_below_threshold
                : null
            }
            after={
              <Link fontWeight="medium" onClick={() => updateAmount(max)}>
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
            body={`${max} DAI`}
          />
          <Info
            title={lang.action_sidebar.new_liquidation_price}
            body={formatValue(liquidationPrice)}
          />
          <Info
            title={lang.action_sidebar.new_collateralization_ratio}
            body={
              <Text color={undercollateralized ? 'linkOrange' : null}>
                {formatValue(collateralizationRatio, 'collateralizationRatio')}%
              </Text>
            }
          />
        </InfoContainer>
      </Grid>
    </SidebarActionLayout>
  );
};
export default Generate;
