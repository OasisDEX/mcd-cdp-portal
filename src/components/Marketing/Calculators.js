import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, Grid, Position, Text } from '@makerdao/ui-components-core';
import ReactSlider from 'react-slider';
import styled from 'styled-components';

import { prettifyCurrency } from 'utils/ui';

import { ReactComponent as BatIcon } from 'images/oasis-tokens/bat.svg';
import { ReactComponent as EthIcon } from 'images/oasis-tokens/eth.svg';
import { ReactComponent as UsdcIcon } from 'images/oasis-tokens/usdc.svg';
import { ReactComponent as WbtcIcon } from 'images/oasis-tokens/wbtc.svg';
import { ReactComponent as CaratDown } from 'images/carat-down-filled.svg';
import { ReactComponent as DaiImg } from 'images/dai-color.svg';

import useLanguage from 'hooks/useLanguage';
import useMaker from 'hooks/useMaker';
import useCdpTypes from 'hooks/useCdpTypes';
import { watch } from 'hooks/useObservable';
import BigNumber from 'bignumber.js';

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
    max-height: 58px;
  `;

  return ({
    items,
    selectedValue,
    onSelected,
    hideSelected = true,
    ...props
  }) => {
    const dropdown = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const getSelectedItem = () =>
      items.find(gem => gem.value === selectedValue);

    useEffect(() => {
      function handleDocumentClick(e) {
        if (!dropdown.current.contains(e.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener('click', handleDocumentClick);
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    });

    return (
      <DropdownStyle ref={dropdown} {...props}>
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
    height: 20px;
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
      renderTrack={props => <Track {...props} />}
      renderThumb={props => <Thumb {...props} />}
      {...props}
    />
  );
})();

const CalculatorStyle = styled(Box)`
  background: #ffffff;
  width: 100vw;
  left: -${props => props.theme.mobilePaddingX};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    width: unset;
    left: unset;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
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

const CapsText = styled(Text)`
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
    line-height: unset;
    font-size: 38px;
    font-weight: 500;
    background: linear-gradient(
      125.96deg,
      #fdc134 17.59%,
      #c9e03b 48.87%,
      #2dc1b1 83.6%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      font-size: 58px;
    }
  `;

  const DaiAmountStyle = styled(Box)`
    .dai-symbol {
      margin-right: 12px;
      position: relative;
      top: 7px;
      width: 39px;

      @media (min-width: ${props => props.theme.breakpoints.m}) {
        margin-right: 15px;
        top: 1px;
        width: unset;
      }
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
  fontSize: '15px',
  color: '#9C9DA7',
  letterSpacing: '0.5px'
}))``;

const getDaiAvailable = (locale, depositAmount, price, colRatio) => {
  if (!price) {
    return '...';
  }
  const daiAvailable = price.times(depositAmount).dividedBy(colRatio / 100);
  return prettifyCurrency(locale, daiAvailable, 0);
};

const BorrowCalcContent = styled(Box)`
  max-width: 396px;
  margin: 0 auto;

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    max-width: unset;
  }
`;

const BorrowCalcTopGrid = styled(Grid)`
  grid-template-columns: 100%;
  grid-template-rows: 45px 116px 84px auto;
  margin: 57px auto 34px;

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    grid-template-columns: 217px 340px;
    grid-template-rows: unset;
    align-items: center;
    grid-row-gap: 84px;
    justify-content: space-around;
    margin: 71px auto 69px;
    padding-right: 4px;
    max-width: 700px;
  }

  @media (min-width: ${props => props.theme.breakpoints.l}) {
    grid-template-columns: 217px 396px;
    max-width: 821px;
  }
`;

const BorrowCalculator = props => {
  const { cdpTypesList } = useCdpTypes();
  const prices = watch.collateralTypesPrices(cdpTypesList);

  const cdpTypesMetaData = {
    'ETH-A': {
      text: 'Ethereum',
      Icon: EthIcon,
      colRatioRange: [500, 200],
      amountRange: [1, 350],
      amountStart: 25
    },
    'BAT-A': {
      Icon: BatIcon,
      colRatioRange: [500, 200],
      amountRange: [200, 70000],
      amountStart: 600
    },
    'USDC-A': {
      Icon: UsdcIcon,
      colRatioRange: [150, 120],
      amountRange: [200, 70000],
      amountStart: 5000
    },
    'WBTC-A': {
      Icon: WbtcIcon,
      colRatioRange: [500, 200],
      amountRange: [0.1, 35],
      amountStart: 0.5
    }
  };

  const gems = cdpTypesList
    .map((cdpTypeName, index) => ({
      name: cdpTypeName,
      price: prices && prices[index].toBigNumber()
    }))
    .filter(cdpType => cdpType.name.endsWith('-A')) // only first cdp type per collateral
    .map(cdpType => ({
      ...cdpType,
      ...cdpTypesMetaData[cdpType.name],
      symbol: cdpType.name.replace('-A', '')
    }));

  const [selectedSymbol, setSelectedSymbol] = useState(gems[0].symbol);
  const selectedGem = gems.find(gem => gem.symbol === selectedSymbol);
  const [collateralAmounts, setCollateralAmounts] = useState(
    gems.reduce((acc, gem) => {
      acc[gem.symbol] = gem.amountStart;
      return acc;
    }, {})
  );
  const { lang } = useLanguage();
  const interfaceLocale = lang.getInterfaceLanguage();

  return (
    <CalculatorStyle px={{ s: '22px', m: '0' }} {...props}>
      <BorrowCalcContent>
        <BorrowCalcTopGrid>
          <CapsText textAlign={{ s: 'left', m: 'right' }}>
            {lang.collateral_type}
          </CapsText>
          <Dropdown
            items={gems.map(gem => ({
              value: gem.symbol,
              render: () => (
                <DropdownItem img={<gem.Icon width="28.33" height="28.33" />}>
                  {gem.text || gem.symbol}
                </DropdownItem>
              )
            }))}
            onSelected={selected => setSelectedSymbol(selected)}
            selectedValue={selectedSymbol}
          />
          <CapsText textAlign={{ s: 'left', m: 'right' }}>
            {lang.collateral_amount}
          </CapsText>
          <Box position="relative">
            <Position position="absolute" bottom="37px" right="0">
              <CapsText textAlign="right" fontSize="21px">
                {collateralAmounts[selectedSymbol]}
                <span style={{ marginLeft: '3px' }}>{selectedGem.symbol}</span>
              </CapsText>
            </Position>
            <Slider
              value={collateralAmounts[selectedSymbol]}
              min={selectedGem.amountRange[0]}
              max={selectedGem.amountRange[1]}
              step={selectedGem.sliderStep || selectedGem.amountRange[0]}
              onChange={value =>
                setCollateralAmounts({
                  ...collateralAmounts,
                  [selectedSymbol]: value
                })
              }
            />
          </Box>
        </BorrowCalcTopGrid>
        <Separator display={{ s: 'none', m: 'block' }} />
        <Box textAlign={{ s: 'left', m: 'center' }} pt="36px" pb="40px">
          <CapsText>{lang.borrow_landing.calc_dai_available}</CapsText>
          <DaiAmount
            mt={{ s: '13px', m: '2px' }}
            mb={{ s: '24px', m: '17px' }}
            ml={{ s: '3px', m: '0' }}
          >
            {getDaiAvailable(
              interfaceLocale,
              collateralAmounts[selectedSymbol],
              selectedGem.price,
              selectedGem.colRatioRange[0]
            )}
            {' - '}
            {getDaiAvailable(
              interfaceLocale,
              collateralAmounts[selectedSymbol],
              selectedGem.price,
              selectedGem.colRatioRange[1]
            )}
          </DaiAmount>
          <Footnote>
            {lang.formatString(lang.borrow_landing.calc_footnote, {
              max_ratio: selectedGem.colRatioRange[0],
              min_ratio: selectedGem.colRatioRange[1]
            })}
          </Footnote>
        </Box>
      </BorrowCalcContent>
    </CalculatorStyle>
  );
};

const SaveCalculator = (() => {
  const SliderWithDisplay = ({ onChange, displayValue, ...props }) => {
    const [value, setValue] = useState(props.value);
    return (
      <Box position="relative">
        <Position position="absolute" bottom="38px" right="0">
          <Text textAlign="right" fontSize="19px">
            {displayValue(value)}
          </Text>
        </Position>
        <Slider
          onChange={value => {
            setValue(value);
            onChange(value);
          }}
          {...props}
        />
      </Box>
    );
  };

  const StyledDaiAmount = styled(DaiAmount)`
    margin-top: 3px;
    margin-bottom: 28px;
    .dai-symbol {
      margin-right: 24px;
    }
  `;

  const getSavings = (dsr, deposit, years) =>
    dsr ? deposit * Math.pow(dsr, years) : null;

  const getTotalSavings = (dsr, initial, monthly, years) => {
    let savings = getSavings(dsr, initial, years);
    if (monthly === 0) {
      return savings;
    }
    const totalMonths = years * 12;
    for (let months = 1; months < totalMonths; months++) {
      savings += getSavings(dsr, monthly, months / 12);
    }
    return savings;
  };

  const SlidersStyle = styled(Box)`
    max-width: 473px;
    margin: 0 auto;
    padding-top: 61px;
    padding-bottom: 22px;

    & > div {
      margin-bottom: 47px;

      & > ${CapsText} {
        margin-bottom: 58px;
      }
    }
  `;

  function getSeparator(locale, separatorType) {
    const numberWithGroupAndDecimalSeparator = 1000.1;
    const numFormat = Intl.NumberFormat(locale);
    return numFormat.formatToParts
      ? numFormat
          .formatToParts(numberWithGroupAndDecimalSeparator)
          .find(part => part.type === separatorType)?.value
      : null;
  }

  const twoDecimalsTruncated = (locale, num) => {
    const threeDecimalsString = new BigNumber(num).toFormat(
      3,
      BigNumber.ROUND_HALF_CEIL,
      {
        decimalSeparator: getSeparator(locale, 'decimal') || '.',
        groupSeparator: getSeparator(locale, 'group'),
        groupSize: 3
      }
    );
    return threeDecimalsString.substr(0, threeDecimalsString.length - 1);
  };

  return props => {
    const { lang } = useLanguage();
    const locale = lang.getInterfaceLanguage();
    const dsr = useDaiSavingsRate()?.toNumber();
    const [initialDeposit, setInitialDeposit] = useState(100);
    const [monthlyContribution, setMonthlyContribution] = useState(0);
    const [timeSliderValue, setTimeSliderValue] = useState(0);
    const yearsEarning = timeSliderValue === 0 ? 0.5 : timeSliderValue;
    const totalDai = getTotalSavings(
      dsr,
      initialDeposit,
      monthlyContribution,
      yearsEarning
    );
    const savings = totalDai
      ? totalDai -
        (initialDeposit + monthlyContribution * (yearsEarning * 12 - 1))
      : null;

    return (
      <CalculatorStyle textAlign="left" {...props}>
        <SlidersStyle>
          <div>
            <CapsText>{lang.save_landing.calc_initial}</CapsText>
            <SliderWithDisplay
              min={100}
              max={100000}
              value={initialDeposit}
              onChange={value => setInitialDeposit(value)}
              displayValue={value =>
                `${prettifyCurrency(locale, value, 0)} DAI`
              }
            />
          </div>
          <div>
            <CapsText>{lang.save_landing.calc_contribution}</CapsText>
            <SliderWithDisplay
              min={0}
              max={10000}
              step={50}
              value={monthlyContribution}
              onChange={value => setMonthlyContribution(value)}
              displayValue={value =>
                `${prettifyCurrency(locale, value, 0)} DAI`
              }
            />
          </div>
          <div>
            <CapsText>{lang.save_landing.calc_how_long}</CapsText>
            {/* todo: use some i18n function for durations */}
            <SliderWithDisplay
              min={0}
              max={25}
              value={timeSliderValue}
              onChange={value => setTimeSliderValue(value)}
              displayValue={value =>
                value === 0 ? '6 months' : `${value} years`
              }
            />
          </div>
        </SlidersStyle>
        <Separator />
        <Box maxWidth="473px" m="0 auto" pt="47px" pb="43px">
          <CapsText>{lang.save_landing.calc_savings_earned}</CapsText>
          <StyledDaiAmount>
            {twoDecimalsTruncated(locale, savings)}
          </StyledDaiAmount>
          <Separator mb="20px" />
          <CapsText>{lang.save_landing.calc_total_dai}</CapsText>
          <StyledDaiAmount>
            {twoDecimalsTruncated(locale, totalDai)}
          </StyledDaiAmount>
          <Footnote>
            {lang.formatString(lang.save_landing.calc_footnote, {
              dsr: dsr ? ((dsr - 1) * 100).toFixed(1) : '...'
            })}
          </Footnote>
        </Box>
      </CalculatorStyle>
    );
  };
})();

export { BorrowCalculator, SaveCalculator };
