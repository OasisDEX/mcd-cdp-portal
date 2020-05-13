import React, { useState, useEffect } from 'react';
import useOraclePrices from 'hooks/useOraclePrices';
import { Box, Flex, Grid, Position, Text } from '@makerdao/ui-components-core';
import ReactSlider from 'react-slider';

import styled from 'styled-components';
import { prettifyCurrency } from 'utils/ui';
import useLanguage from 'hooks/useLanguage';

import { ReactComponent as BatIcon } from 'images/oasis-tokens/bat.svg';
import { ReactComponent as EthIcon } from 'images/oasis-tokens/eth.svg';
import { ReactComponent as UsdcIcon } from 'images/oasis-tokens/usdc.svg';
import { ReactComponent as WbtcIcon } from 'images/oasis-tokens/wbtc.svg';

import { ReactComponent as CaratDown } from 'images/carat-down-filled.svg';
import { ReactComponent as DaiImg } from 'images/dai-color.svg';
import useMaker from 'hooks/useMaker';

const Dropdown = (() => {
  const Trigger = styled(Flex)`
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    border: 1px solid #d4d9e1;
    border-radius: 5px;
    padding-right: 27px;
    cursor: pointer;
  `;

  const Items = styled(Box)`
    position: absolute;
    z-index: 2;
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
    position: relative;
  `;

  return ({
    items,
    selectedValue,
    onSelected,
    hideSelected = true,
    ...props
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getSelectedItem = () =>
      items.find(gem => gem.value === selectedValue);

    return (
      <DropdownStyle {...props}>
        <Trigger onClick={() => setIsOpen(!isOpen)}>
          {getSelectedItem().render()}
          <CaratDown style={{ fill: '#231536', marginTop: '2px' }} />
        </Trigger>
        <Items display={isOpen ? 'block' : 'none'}>
          {items
            .filter(item => !hideSelected || item.value !== selectedValue)
            .map(item => (
              <div
                key={item.value}
                onClick={() => {
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

const Slider = (() => {
  const StyledSlider = styled(ReactSlider)`
    width: 100%;
  `;

  const Thumb = styled.div`
    width: 20px;
    height: 20px;
    top: -8px;
    background: #231536;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    cursor: grab;
    border-radius: 50%;

    :focus {
      outline: none;
    }
  `;

  const Track = styled.div`
    background: #dedce1;
    border-radius: 3px;
    height: 4px;
  `;

  return props => (
    <StyledSlider
      min={5}
      max={200}
      step={5}
      renderTrack={props => <Track {...props} />}
      renderThumb={props => <Thumb {...props} />}
      {...props}
    />
  );
})();

const CalculatorStyle = styled(Box)`
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
`;

const DropdownItemStyle = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  text-align: left;
  padding-left: 26px;
  cursor: pointer;

  svg {
    margin-right: 13px;
  }
`;

const DropdownItem = ({ img, children }) => (
  <DropdownItemStyle className="item">
    {img}
    <Text className="text" fontSize="18px" letterSpacing="0.5px">
      {children}
    </Text>
  </DropdownItemStyle>
);

const getDaiAvailable = (locale, depositAmount, price, colRatio) => {
  if (!price) {
    return '...';
  }
  const daiAvailable = price.times(depositAmount).dividedBy(colRatio / 100);
  return prettifyCurrency(locale, daiAvailable, 0);
};

const CapsText = styled(Text).attrs(props => ({
  fontSize: props.fontSize || 's'
}))`
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: bold;
  display: block;
`;

const useDaiSavingsRate = () => {
  const [rate, setRate] = useState(null);
  const { maker } = useMaker();

  useEffect(() => {
    (async () => {
      const savingsService = maker.service('mcd:savings');
      setRate(await savingsService.getYearlyRate());
    })();
  }, [maker]);

  return rate;
};

const DaiAmount = (() => {
  const GradientValue = styled(Text)`
    font-size: 58px;
    font-weight: 500;
    background: linear-gradient(
      125.96deg,
      #fdc134 17.59%,
      #c9e03b 48.87%,
      #2dc1b1 83.6%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `;

  const DaiAmountStyle = styled(Box)`
    .dai-symbol {
      margin-right: 15px;
      position: relative;
      top: 1px;
    }
  `;

  return ({ children, ...props }) => (
    <DaiAmountStyle {...props}>
      <DaiImg className="dai-symbol" />
      <GradientValue>{children}</GradientValue>
    </DaiAmountStyle>
  );
})();

const Separator = styled(Box)`
  background-color: #e5e5e5;
  height: 1px;
`;

const Footnote = styled(Text).attrs(() => ({
  fontSize: '16px',
  color: '#9C9DA7',
  letterSpacing: '0.5px'
}))``;

const BorrowCalculator = props => {
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
  const [collateralAmount, setCollateralAmount] = useState(120);
  const { lang } = useLanguage();
  const interfaceLocale = lang.getInterfaceLanguage();

  return (
    <CalculatorStyle {...props}>
      <Grid
        gridTemplateColumns="217px 396px"
        alignItems="center"
        gridColumnGap="100px"
        gridRowGap="84px"
        justifyContent="center"
        mt="71px"
        mb="69px"
        mr="4px"
      >
        <CapsText textAlign="right">{lang.collateral_type}</CapsText>
        <Dropdown
          items={gems.map(gem => ({
            value: gem.symbol,
            render: () => (
              <DropdownItem img={<gem.Icon width="28.33" height="28.33" />}>
                {gem.name || gem.symbol}
              </DropdownItem>
            )
          }))}
          onSelected={selected => setSelectedValue(selected)}
          selectedValue={selectedValue}
        />
        <CapsText textAlign="right">{lang.collateral_amount}</CapsText>
        <Box position="relative">
          <Position position="absolute" bottom="17px" right="0">
            <CapsText textAlign="right" fontSize="22px">
              {collateralAmount}
              <span style={{ marginLeft: '3px' }}>{selectedGem.symbol}</span>
            </CapsText>
          </Position>
          <Slider
            defaultValue={collateralAmount}
            onChange={value => setCollateralAmount(value)}
          />
        </Box>
      </Grid>
      <Separator />
      <Box textAlign="center" pt="36px" pb="40px">
        <CapsText fontSize="s">
          {lang.borrow_landing.calc_dai_available}
        </CapsText>
        <DaiAmount mt="18px" mb="27px">
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
        </DaiAmount>
        <Footnote>
          {lang.formatString(lang.borrow_landing.calc_footnote, {
            fee: '[todo]',
            max_ratio: colRatioRange[0],
            min_ratio: colRatioRange[1]
          })}
        </Footnote>
      </Box>
    </CalculatorStyle>
  );
};

const SaveCalculator = (() => {
  const DepositButton = styled(Flex)`
    border: 1px solid #d4d9e1;
    box-sizing: border-box;
    border-radius: 5px;
    width: 99px;
    text-align: center;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &.selected {
      border-color: ${props => props.theme.colors.darkPurple};
      cursor: default;
    }
  `;

  const StyledDaiAmount = styled(DaiAmount)`
    .dai-symbol {
      margin-right: 24px;
    }
  `;

  return props => {
    const { lang } = useLanguage();
    const locale = lang.getInterfaceLanguage();
    const dsr = useDaiSavingsRate()?.toNumber();
    const deposits = [500, 2000, 4000, 6000];
    const [depositIndex, setDepositIndex] = useState(0);
    const [yearsEarning, setYearsEarning] = useState(1);
    const totalDai = dsr
      ? deposits[depositIndex] * Math.pow(dsr, yearsEarning)
      : null;
    const savings = totalDai ? totalDai - deposits[depositIndex] : null;

    return (
      <CalculatorStyle textAlign="left" {...props}>
        <Box maxWidth="473px" m="0 auto" pt="57px" pb="64px">
          <CapsText>{lang.save_landing.calc_how_much}</CapsText>
          <Flex
            justifyContent="space-between"
            mt="19px"
            mb="43px"
            height="58px"
          >
            {deposits.map((amount, index) => (
              <DepositButton
                key={index}
                onClick={() => setDepositIndex(index)}
                className={depositIndex === index ? 'selected' : ''}
              >
                <Text fontSize="s">${amount}</Text>
              </DepositButton>
            ))}
          </Flex>
          <CapsText>{lang.save_landing.calc_how_long}</CapsText>
          {/* todo: use some i18n function for durations */}
          <Dropdown
            mt="7px"
            items={[
              {
                text: '1 month',
                years: 1 / 12
              },
              {
                text: '6 months',
                years: 0.5
              },
              {
                text: '1 year',
                years: 1
              },
              {
                text: '2 years',
                years: 2
              },
              {
                text: '10 years',
                years: 10
              }
            ].map(duration => ({
              value: duration.years,
              render: () => <DropdownItem>{duration.text}</DropdownItem>
            }))}
            onSelected={value => setYearsEarning(value)}
            selectedValue={yearsEarning}
            hideSelected={false}
          />
        </Box>
        <Separator />
        <Box maxWidth="473px" m="0 auto" pt="43px" pb="92px">
          <CapsText>{lang.save_landing.calc_savings_earned}</CapsText>
          <StyledDaiAmount mt="19px" mb="36px">
            {prettifyCurrency(locale, savings, 0)}
          </StyledDaiAmount>
          <Separator mb="16px" />
          <CapsText>{lang.save_landing.calc_total_dai}</CapsText>
          <StyledDaiAmount mt="19px" mb="39px">
            {prettifyCurrency(locale, totalDai, 0)}
          </StyledDaiAmount>
          <Footnote>
            {lang.formatString(lang.save_landing.calc_footnote, {
              dsr: dsr ? ((dsr - 1) * 100).toFixed(2) : '...'
            })}
          </Footnote>
        </Box>
      </CalculatorStyle>
    );
  };
})();

export { BorrowCalculator, SaveCalculator };
