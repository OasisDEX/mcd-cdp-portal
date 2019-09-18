import React, { useCallback } from 'react';
import { Box, Grid, Text, Input, Card } from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import { prettifyNumber } from 'utils/ui';

import lang from 'languages';
import ScreenFooter from './ScreenFooter';
import ScreenHeader from './ScreenHeader';
import useStore from '../../hooks/useStore';
import useWalletBalances from '../../hooks/useWalletBalances';
import useValidatedInput from '../../hooks/useValidatedInput';
import SetMax from '../SetMax';

const placeholder = 'test';

function DepositDaiForm({
  depositAmount,
  daiBalance,
  onDepositAmountChange,
  handleInputChange,
  setDepositMax,
  depositAmountErrors
}) {
  const fields = [
    [
      lang.formatString(lang.dsr_deposit.deposit_form_title, 'DAI'),
      <Input
        key="daiinput"
        name="gemsToLock"
        after={<SetMax onClick={setDepositMax} />}
        type="number"
        value={depositAmount}
        onChange={onDepositAmountChange}
        failureMessage={depositAmountErrors}
        min="0"
        placeholder="0 DAI"
      />,
      <Box key="ba">
        <Text t="subheading">{lang.your_balance} </Text>
        <Text
          t="caption"
          display="inline-block"
          ml="s"
          color="darkLavender"
          onClick={() => {
            handleInputChange({
              target: {
                name: 'gemsToLock',
                value: placeholder
              }
            });
          }}
        >
          {prettifyNumber(daiBalance)} {'DAI'}
        </Text>
      </Box>
    ]
  ];

  return (
    <Grid gridRowGap="l" maxWidth="100%">
      <Grid
        gridTemplateColumns="auto"
        gridRowGap="l"
        gridColumnGap="m"
        alignItems="center"
      >
        {fields.map(([title, text, input, renderAfter]) => {
          return (
            <Grid gridRowGap="s" key={title}>
              <Grid gridRowGap="xs">
                <TextBlock t="h5" lineHeight="normal">
                  {title}
                </TextBlock>
                <TextBlock t="body">{text}</TextBlock>
              </Grid>
              <Box py="2xs">{input}</Box>
              {renderAfter}
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}

const DSRDepositCreate = ({ dispatch, onClose }) => {
  const balances = useWalletBalances();
  const { MDAI } = balances;
  const daiBalance = MDAI.toFixed(6);

  const [
    depositAmount,
    setDepositAmount,
    onDepositAmountChange,
    depositAmountErrors
  ] = useValidatedInput(
    '',
    {
      isFloat: true,
      minFloat: 0.0,
      maxFloat: MDAI && MDAI.toNumber()
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.insufficient_balance, 'DAI')
    }
  );

  const setDepositMax = useCallback(() => {
    if (MDAI) {
      setDepositAmount(MDAI.toNumber().toString());
    } else {
      setDepositAmount('0');
    }
  }, [MDAI, setDepositAmount]);
  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <ScreenHeader
        title={lang.formatString(lang.save.deposit_dai)}
        text={lang.save.deposit_dai_subheading}
      />
      <Grid gridGap="m" my="l">
        <Card px={{ s: 'm', m: 'xl' }} py={{ s: 'm', m: 'l' }}>
          <DepositDaiForm
            daiBalance={daiBalance}
            setDepositMax={setDepositMax}
            depositAmount={depositAmount}
            onDepositAmountChange={onDepositAmountChange}
            depositAmountErrors={depositAmountErrors}
          />
        </Card>
      </Grid>
      <ScreenFooter
        onNext={() => {
          dispatch({
            type: 'form/set-deposit-amount',
            payload: { depositAmount }
          });
          dispatch({ type: 'increment-step' });
        }}
        onBack={onClose}
        secondaryButtonText={lang.actions.skip}
        canProgress={!!depositAmount && !depositAmountErrors}
      />
    </Box>
  );
};
export default DSRDepositCreate;
