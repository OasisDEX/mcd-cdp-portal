import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, Grid, Position, Text } from '@makerdao/ui-components-core';
import ReactSlider from 'react-slider';
import styled from 'styled-components';

import { prettifyCurrency } from 'utils/ui';
import TokenIcon from './TokenIcon';
import { ReactComponent as CaratDown } from 'images/carat-down-filled.svg';
import { ReactComponent as DaiImg } from 'images/dai-color.svg';

import useLanguage from 'hooks/useLanguage';
import useMaker from 'hooks/useMaker';
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
    grid-template-columns: 40% 40%;
    grid-column-gap: 8%;
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
        if (dropdown.current && !dropdown.current.contains(e.target)) {
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
        <Items display={isOpen ? 'grid' : 'none'}>
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
                {item.render(item.value === selectedValue)}
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

const DropdownItem = ({ img, children, isSelected }) => (
  <DropdownItemStyle
    className="item"
    style={isSelected ? { cursor: 'default' } : {}}
  >
    {img}
    <Text
      className="text"
      fontSize="18px"
      letterSpacing="0.5px"
      style={isSelected ? { color: 'black', opacity: '1.0' } : {}}
    >
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

export const useDaiSavingsRate = () => {
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
  const GradientValue = styled(Text.h1)`
    display: inline;
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
      position: relative;
      margin-right: 22px;
      top: 5px;
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

// Increases value relative to the number of digits.
const SmartStepSlider = ({
  min,
  max,
  onChange,
  secondDigitIncrease = 1,
  ...props
}) => {
  const [values, setValues] = useState([min]);
  useEffect(() => {
    // load values to be shown on the slider
    const _min = Math.floor(min);
    const _max = Math.floor(max);
    let sliderValues = [];
    let _value = _min;
    while (_value < _max) {
      sliderValues.push(_value);
      const digits = _value.toString().length;
      if (digits === 1) {
        _value++;
        continue;
      }
      _value += Math.pow(10, digits - 2) * secondDigitIncrease;
    }
    sliderValues.push(_max);
    setValues(sliderValues);
  }, [min, max, secondDigitIncrease]);

  return (
    <Slider
      min={0}
      max={values.length - 1}
      onChange={index => {
        onChange(() => values[index]);
      }}
      {...props}
    />
  );
};

const cdpTypesMetaData = {
  'ETH-A': {
    colRatio: 200,
    amountRange: [1, 350],
    amountStart: 25
  },
  'BAT-A': {
    colRatio: 200,
    amountRange: [200, 70000],
    amountStart: 600
  },
  'MANA-A': {
    colRatio: 240,
    amountRange: [1000, 350000],
    amountStart: 3000
  },
  'USDC-A': {
    colRatio: 120,
    amountRange: [200, 70000],
    amountStart: 5000
  },
  'WBTC-A': {
    colRatio: 200,
    amountRange: [0.1, 35],
    amountStart: 0.5
  },
  'TUSD-A': {
    colRatio: 120,
    amountRange: [200, 70000],
    amountStart: 5000
  },
  'ZRX-A': {
    colRatio: 200,
    amountRange: [200, 70000],
    amountStart: 100
  },
  'KNC-A': {
    colRatio: 200,
    amountRange: [200, 70000],
    amountStart: 100
  },
  'COMP-A': {
    colRatio: 200,
    amountRange: [100, 5000],
    amountStart: 100
  },
  'LRC-A': {
    colRatio: 200,
    amountRange: [200, 70000],
    amountStart: 600
  },
  'LINK-A': {
    colRatio: 200,
    amountRange: [200, 70000],
    amountStart: 100
  },
  'YFI-A': {
    colRatio: 200,
    amountRange: [0.1, 35],
    amountStart: 0.5
  },
  'BAL-A': {
    colRatio: 200,
    amountRange: [200, 70000],
    amountStart: 100
  },
  'GUSD-A': {
    colRatio: 200,
    amountRange: [200, 70000],
    amountStart: 100
  }
};

const BorrowCalculator = ({ prices, cdpTypesList, ...props }) => {
  const { lang } = useLanguage();
  const [selectedSymbol, setSelectedSymbol] = useState('ETH-A');

  const interfaceLocale = lang.getInterfaceLanguage();

  const ilks = cdpTypesList
    .map((cdpTypeName, index) => ({
      symbol: cdpTypeName,
      price: prices[index].toBigNumber()
    }))
    .filter(cdpType => cdpTypesMetaData[cdpType.symbol])
    .map(cdpType => ({
      ...cdpType,
      ...cdpTypesMetaData[cdpType.symbol]
    }));

  const selectedIlk = ilks.find(ilk => ilk.symbol === selectedSymbol);
  const getTokenName = ilk => ilk.symbol.split('-')[0];
  const collateralAmounts = ilks.reduce((acc, ilk) => {
    acc[ilk.symbol] = ilk.amountStart;
    return acc;
  }, {});

  const [collateralAmount, setCollateralAmount] = useState(
    collateralAmounts[selectedSymbol]
  );

  useEffect(() => {
    setCollateralAmount(collateralAmounts[selectedSymbol]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSymbol]);
  return (
    <CalculatorStyle px={{ s: '22px', m: '0' }} {...props}>
      <BorrowCalcContent>
        <BorrowCalcTopGrid>
          <CapsText textAlign={{ s: 'left', m: 'right' }}>
            {lang.collateral_type}
          </CapsText>
          <Dropdown
            hideSelected={false}
            items={ilks.map(ilk => ({
              value: ilk.symbol,
              render: isSelected => (
                <DropdownItem
                  img={
                    <TokenIcon
                      symbol={getTokenName(ilk)}
                      width="28.33"
                      height="28.33"
                    />
                  }
                  isSelected={isSelected}
                >
                  {getTokenName(ilk)}
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
              <CapsText textAlign="right" data-testid="amount-chosen">
                {collateralAmount}
                <span style={{ marginLeft: '3px' }}>
                  {getTokenName(selectedIlk)}
                </span>
              </CapsText>
            </Position>
            <Slider
              value={collateralAmount}
              min={selectedIlk.amountRange[0]}
              max={selectedIlk.amountRange[1]}
              step={selectedIlk.sliderStep || selectedIlk.amountRange[0]}
              onChange={setCollateralAmount}
            />
          </Box>
        </BorrowCalcTopGrid>
        <Separator display={{ s: 'none', m: 'block' }} />
        <Box textAlign={{ s: 'left', m: 'center' }} pt="39px" pb="42px">
          <CapsText>
            {lang.formatString(lang.borrow_landing.calc_dai_available, {
              amount: (
                <DaiAmount
                  mt={{ s: '13px', m: '10px' }}
                  mb={{ s: '24px', m: '23px' }}
                  ml={{ s: '3px', m: '0' }}
                >
                  {getDaiAvailable(
                    interfaceLocale,
                    collateralAmount,
                    selectedIlk.price,
                    selectedIlk.colRatio
                  )}
                </DaiAmount>
              )
            })}
          </CapsText>
          <Box height="23px" />
          <Footnote>
            {lang.formatString(lang.borrow_landing.calc_footnote, {
              ratio: selectedIlk.colRatio
            })}
          </Footnote>
        </Box>
      </BorrowCalcContent>
    </CalculatorStyle>
  );
};

const SaveCalculator = (() => {
  const SliderWithDisplay = ({
    CustomSlider,
    onChange,
    displayValue,
    ...props
  }) => {
    const [value, setValue] = useState(props.value);
    const UsedSlider = CustomSlider || Slider;
    return (
      <Box position="relative">
        <Position position="absolute" bottom="38px" right="0">
          <Text textAlign="right" fontSize="19px">
            {displayValue(value)}
          </Text>
        </Position>
        <UsedSlider
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
    margin-top: 11px;
    margin-bottom: 29px;
    .dai-symbol {
      margin-right: 16px;
      transform: scale(0.92);
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

  const Content = styled(Box)`
    max-width: 519px;
    margin: 0 auto;
    padding-right: 23px;
    padding-left: 23px;
  `;

  const SliderAndLabel = styled(Box)`
    margin-bottom: 47px;

    & > ${CapsText} {
      margin-bottom: 58px;
    }
  `;

  // todo: This varies between browsers. Fix, remove or replace.
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
        <Content pt="61px" pb="22px">
          <SliderAndLabel>
            <CapsText>{lang.save_landing.calc_initial}</CapsText>
            <SliderWithDisplay
              CustomSlider={SmartStepSlider}
              min={100}
              max={100000}
              value={initialDeposit}
              onChange={value => setInitialDeposit(value)}
              displayValue={value =>
                `${prettifyCurrency(locale, value, 0)} DAI`
              }
            />
          </SliderAndLabel>
          <SliderAndLabel>
            <CapsText>{lang.save_landing.calc_contribution}</CapsText>
            <SliderWithDisplay
              CustomSlider={SmartStepSlider}
              min={0}
              max={10000}
              value={monthlyContribution}
              onChange={value => setMonthlyContribution(value)}
              displayValue={value =>
                `${prettifyCurrency(locale, value, 0)} DAI`
              }
            />
          </SliderAndLabel>
          <SliderAndLabel>
            <CapsText>{lang.save_landing.calc_how_long}</CapsText>
            {/* todo: use some i18n function for durations */}
            <SliderWithDisplay
              min={0}
              max={25}
              value={timeSliderValue}
              onChange={value => setTimeSliderValue(value)}
              displayValue={value =>
                value === 0
                  ? '6 months'
                  : `${value} year${value > 1 ? 's' : ''}`
              }
            />
          </SliderAndLabel>
        </Content>
        <Separator />
        <Content pt="46px" pb="58px">
          <CapsText>{lang.save_landing.calc_savings_earned}</CapsText>
          <StyledDaiAmount>
            {twoDecimalsTruncated(locale, savings)}
          </StyledDaiAmount>
          <Separator mt="4px" mb="30px" display={{ s: 'none', m: 'block' }} />
          <CapsText>{lang.save_landing.calc_total_dai}</CapsText>
          <StyledDaiAmount>
            {twoDecimalsTruncated(locale, totalDai)}
          </StyledDaiAmount>
          <Footnote>
            {lang.formatString(lang.save_landing.calc_footnote, {
              dsr: dsr ? ((dsr - 1) * 100).toFixed(1) : '...'
            })}
          </Footnote>
        </Content>
      </CalculatorStyle>
    );
  };
})();

export { BorrowCalculator, SaveCalculator };
