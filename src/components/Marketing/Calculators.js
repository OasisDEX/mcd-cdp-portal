import React, { useState, useEffect } from 'react';
import useMaker from 'hooks/useMaker';
import uniqBy from 'lodash.uniqby';
import { Box } from '@makerdao/ui-components-core';
import styled from 'styled-components';

import { ReactComponent as BatIcon } from 'images/oasis-tokens/bat.svg';
import { ReactComponent as EthIcon } from 'images/oasis-tokens/eth.svg';
import { ReactComponent as UsdcIcon } from 'images/oasis-tokens/usdc.svg';
import { ReactComponent as WbtcIcon } from 'images/oasis-tokens/wbtc.svg';
import useOraclePrices from '../../hooks/useOraclePrices';

const Dropdown = (() => {
  const Trigger = styled(Box)``;

  const Items = styled(Box)``;

  const DropdownStyle = styled(Box)``;

  return ({ items, onSelected }) => {
    const [selected, setSelected] = useState(items[0].value);
    const [isOpen, setIsOpen] = useState(false);

    const getSelectedItem = () => items.find(gem => gem.value === selected);

    return (
      <DropdownStyle>
        <Trigger onClick={() => setIsOpen(!isOpen)}>
          {getSelectedItem().render()}
        </Trigger>
        <Items display={isOpen ? 'block' : 'none'}>
          {items
            .filter(item => item.value !== selected)
            .map(item => (
              <div
                key={item.value}
                onClick={() => {
                  setSelected(item.value);
                  onSelected(item.value);
                }}
              >
                {item.render()}
              </div>
            ))}
        </Items>
      </DropdownStyle>
    );
  };
})();

const CalculatorStyle = styled(Box)``;

// can_borrow = (deposit_amount*price)/(ratio/100)

const ItemWithIcon = ({ img, text }) => (
  <div>
    {img}
    {text}
  </div>
);

const BorrowCalculator = () => {
  // todo: find where to better get the price from in the code
  const { currentPrice: ethPrice } = useOraclePrices({ gem: 'ETH' });
  const { currentPrice: batPrice } = useOraclePrices({ gem: 'BAT' });
  const { currentPrice: usdcPrice } = useOraclePrices({ gem: 'USDC' });

  console.log('PRICE:', ethPrice);
  const gems = [
    { symbol: 'ETH', name: 'Ethereum', Icon: EthIcon, price: ethPrice },
    { symbol: 'BAT', Icon: BatIcon, price: batPrice },
    { symbol: 'USDC', Icon: UsdcIcon, price: usdcPrice }
  ];

  const [selectedValue, setSelectedValue] = useState(gems[0].symbol);
  const selectedGem = gems.find(gem => gem.symbol === selectedValue);

  return (
    <CalculatorStyle>
      <Dropdown
        items={gems.map(gem => ({
          value: gem.symbol,
          render: () => (
            <ItemWithIcon
              text={gem.name || gem.symbol}
              img={<gem.Icon width="28.33" height="28.33" />}
            />
          )
        }))}
        onSelected={selected => setSelectedValue(selected)}
      />
      <div>
        {selectedGem.symbol} price:{' '}
        {selectedGem.price && selectedGem.price.toString()}
      </div>
    </CalculatorStyle>
  );
};

export { BorrowCalculator };
