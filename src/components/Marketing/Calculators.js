import React, { useState, useEffect } from 'react';
import useMaker from 'hooks/useMaker';
import uniqBy from 'lodash.uniqby';
import { Box } from '@makerdao/ui-components-core';
import styled from 'styled-components';

import { ReactComponent as BatIcon } from 'images/oasis-tokens/bat.svg';
import { ReactComponent as EthIcon } from 'images/oasis-tokens/eth.svg';
import { ReactComponent as UsdcIcon } from 'images/oasis-tokens/usdc.svg';
import { ReactComponent as WbtcIcon } from 'images/oasis-tokens/wbtc.svg';

const gemsData = {
  ETH: { name: 'Ethereum', Icon: EthIcon },
  BAT: { Icon: BatIcon },
  USDC: { Icon: UsdcIcon },
  WBTC: { Icon: WbtcIcon }
};

const Dropdown = (() => {
  const Trigger = styled(Box)``;

  const Item = ({ gem }) => (
    <div>
      <gem.Icon />
      {gem.name || gem.symbol}
    </div>
  );

  const Items = styled(Box)``;

  const DropdownStyle = styled(Box)``;

  return ({ gems, onSelected }) => {
    const [selected, setSelected] = useState(gems[0].symbol);
    const [isOpen, setIsOpen] = useState(false);

    const getSelectedGem = () => gems.find(gem => gem.symbol === selected);

    return (
      <DropdownStyle>
        <Trigger onClick={() => setIsOpen(!isOpen)}>
          <Item gem={getSelectedGem()} />
        </Trigger>
        <Items display={isOpen}>
          {gems
            .filter(gem => gem !== getSelectedGem())
            .map(gem => (
              <Item
                key={gem.symbol}
                gem={gem}
                onClick={() => {
                  setSelected(gem.symbol);
                  onSelected(gem.symbol);
                }}
              />
            ))}
        </Items>
      </DropdownStyle>
    );
  };
})();

const CalculatorStyle = styled(Box)``;

// can_borrow = (deposit_amount*price)/(ratio/100)

const BorrowCalculator = () => {
  const { maker } = useMaker();
  const [gems, setgems] = useState([]);

  // todo: find where to better get the price from in the code

  useEffect(() => {
    const { cdpTypes } = maker.service('mcd:cdpType');
    const uniqCdpTypes = uniqBy(cdpTypes, cdpt => cdpt.currency.symbol);
    console.dir(uniqCdpTypes);
    const cdpsData = uniqCdpTypes.map(cdpType => {
      return {
        symbol: cdpType.currency.symbol,
        price: cdpType.price,
        ...gemsData[cdpType.currency.symbol]
      };
    });
    setgems(cdpsData);
  }, [maker]);

  return (
    <CalculatorStyle>
      {gems.length > 0 && <Dropdown gems={gems} />}
    </CalculatorStyle>
  );
};

export { BorrowCalculator };
