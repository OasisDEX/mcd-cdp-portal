import React, { useState } from 'react';
import useOraclePrices from 'hooks/useOraclePrices';
import { Box, Flex, Text } from '@makerdao/ui-components-core';

import styled from 'styled-components';
import { prettifyCurrency } from 'utils/ui';
import useLanguage from 'hooks/useLanguage';

import { ReactComponent as BatIcon } from 'images/oasis-tokens/bat.svg';
import { ReactComponent as EthIcon } from 'images/oasis-tokens/eth.svg';
import { ReactComponent as UsdcIcon } from 'images/oasis-tokens/usdc.svg';
import { ReactComponent as WbtcIcon } from 'images/oasis-tokens/wbtc.svg';

import { ReactComponent as CaratDown } from 'images/carat-down-filled.svg';

const Dropdown = (() => {
  const Trigger = styled(Flex)`
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    border: 1px solid #d4d9e1;
    border-radius: 5px;
    padding-right: 27.79px;
    cursor: pointer;
  `;

  const Items = styled(Box)`
    position: absolute;
    z-index: 1;
    width: calc(100% - 2px);
    top: calc(100% + 5px);
    right: 0;
    background: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding-top: 12px;
    padding-left: 1px;
    padding-bottom: 16px;

    .item:hover .text {
      opacity: 0.6;
    }
  `;

  const DropdownStyle = styled(Box)`
    width: 396px;
    position: relative;
  `;

  return ({ items, onSelected }) => {
    const [selected, setSelected] = useState(items[0].value);
    const [isOpen, setIsOpen] = useState(false);

    const getSelectedItem = () => items.find(gem => gem.value === selected);

    return (
      <DropdownStyle>
        <Trigger onClick={() => setIsOpen(!isOpen)}>
          {getSelectedItem().render()}
          <CaratDown style={{ fill: '#231536' }} />
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
                  setIsOpen(false);
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

const CalculatorStyle = styled(Box)`
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  width: 980px;
  height: 554px;
  padding: 20px;
`;

const ItemWithIconStyle = styled.div`
  height: 58px;
  display: flex;
  align-items: center;
  text-align: left;
  padding-left: 26.83px;
  cursor: pointer;

  svg {
    margin-right: 14px;
  }
`;

const ItemWithIcon = ({ img, text }) => (
  <ItemWithIconStyle className="item">
    {img}
    <Text className="text" fontSize="18px" letterSpacing="0.5px">
      {text}
    </Text>
  </ItemWithIconStyle>
);

const getDaiAvailable = (locale, depositAmount, price, colRatio) => {
  if (!price) {
    return '...';
  }
  const daiAvailable = price.times(depositAmount).dividedBy(colRatio / 100);
  return prettifyCurrency(locale, daiAvailable, 0);
};

const BorrowCalculator = () => {
  const gems = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      Icon: EthIcon,
      price: useOraclePrices({ gem: 'ETH' }).currentPrice
    },
    {
      symbol: 'BAT',
      Icon: BatIcon,
      price: useOraclePrices({ gem: 'BAT' }).currentPrice
    },
    {
      symbol: 'USDC',
      Icon: UsdcIcon,
      price: useOraclePrices({ gem: 'USDC' }).currentPrice
    },
    {
      symbol: 'WBTC',
      Icon: WbtcIcon,
      price: useOraclePrices({ gem: 'WBTC' }).currentPrice
    }
  ];

  const [selectedValue, setSelectedValue] = useState(gems[0].symbol);
  const selectedGem = gems.find(gem => gem.symbol === selectedValue);
  const colRatioRange = [500, 200];
  const collateralAmount = 120;
  const { lang } = useLanguage();
  const interfaceLocale = lang.getInterfaceLanguage();

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
      <div>Collateral amount: {collateralAmount}</div>
      <div>
        {selectedGem.symbol} price:{' '}
        {selectedGem.price && selectedGem.price.toString()}
      </div>
      <div>
        <div style={{ fontSize: '20px' }}>
          Dai Available{' '}
          <Text fontSize="15px" color="gray">
            formula: (deposit_amount * price)/(ratio/100)
          </Text>
          :
        </div>
        <div style={{ fontSize: '58px' }}>
          {getDaiAvailable(
            interfaceLocale,
            collateralAmount,
            selectedGem.price,
            colRatioRange[0]
          )}
          {' - '}
          {getDaiAvailable(
            interfaceLocale,
            collateralAmount,
            selectedGem.price,
            colRatioRange[1]
          )}
        </div>
        <div>
          Collateralization Ratio between {colRatioRange[0]}% -{' '}
          {colRatioRange[1]}%
        </div>
      </div>
    </CalculatorStyle>
  );
};

export { BorrowCalculator };
