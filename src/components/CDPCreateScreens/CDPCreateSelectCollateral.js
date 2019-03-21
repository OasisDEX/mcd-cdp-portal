import React from 'react';
import { Box, Grid, Table, Flex, Checkbox } from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import TwoColumnCardsLayout from 'layouts/TwoColumnCardsLayout';
import { connect } from 'react-redux';

import { prettifyNumber } from 'utils/ui';
import { getIlkData } from 'reducers/network/ilks';

import useMaker from 'hooks/useMaker';
import lang from 'languages';
import ScreenFooter from './ScreenFooter';
import ScreenHeader from './ScreenHeader';

const CDPCreateSelectCollateralSidebar = () => (
  <Box px="l" py="m">
    <Box>
      {[
        [lang.stability_fee, lang.cdp_create.stability_fee_description],
        [lang.liquidation_ratio, lang.cdp_create.liquidation_ratio_description],
        [
          lang.liquidation_penalty,
          lang.cdp_create.liquidation_penalty_description
        ]
      ].map(([title, text]) => (
        <Grid mb="m" key={title} gridRowGap="xs">
          <TextBlock t="textM" fontWeight="medium">
            {title}
          </TextBlock>
          <TextBlock t="textS" color="black3">
            {text}
          </TextBlock>
        </Grid>
      ))}
    </Box>
  </Box>
);

function IlkTableRowView({ ilk, checked, dispatch }) {
  const { maker } = useMaker();
  const [userGemBalance, setUserGemBalance] = React.useState(null);

  async function checkGemBalance() {
    setUserGemBalance(await maker.getToken(ilk.gem).balance());
  }

  React.useEffect(() => {
    checkGemBalance();
  }, []);

  return (
    <tbody
      css={`
        border-bottom: 1px solid;
        border-bottom-color: ${({ theme }) => theme.colors.grayLight6};
      `}
    >
      <tr>
        <td>
          <Checkbox
            checked={checked}
            onChange={() =>
              checked
                ? dispatch({
                    type: 'reset-ilk'
                  })
                : dispatch({
                    type: 'set-ilk',
                    payload: {
                      key: ilk.key,
                      gemBalance: userGemBalance.toNumber(),
                      currency: ilk.currency,
                      data: ilk.data
                    }
                  })
            }
            mr="xs"
          />
        </td>
        <td>{ilk.symbol}</td>
        <td>{ilk.data.rate} %</td>
        <td>{ilk.data.liquidationRatio} %</td>
        <td>{ilk.data.liquidationPenalty} %</td>
        <td>{prettifyNumber(userGemBalance)}</td>
      </tr>
    </tbody>
  );
}

function mapStateToProps(state, { ilk }) {
  return {
    ilk: {
      ...ilk,
      data: getIlkData(state, ilk.key)
    }
  };
}

const IlkTableRow = connect(
  mapStateToProps,
  {}
)(IlkTableRowView);

const CDPCreateSelectCollateral = ({
  selectedIlk,
  dispatch,
  actionableIlks
}) => {
  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <ScreenHeader
        title={lang.cdp_create.select_title}
        text={lang.cdp_create.select_text}
      />
      <Box my="l">
        <TwoColumnCardsLayout
          ratio={[6, 3]}
          mainContent={
            <Flex justifyContent="center" px="l" py="m">
              <Table width="100%">
                <thead>
                  <tr>
                    <th />
                    {[
                      lang.collateral_type,
                      lang.stability_fee,
                      lang.liquidation_ratio_shortened,
                      lang.liquidation_penalty_shortened,
                      lang.your_balance
                    ].map(t => (
                      <th key={t}>{t}</th>
                    ))}
                  </tr>
                </thead>
                {actionableIlks.map(ilk => (
                  <IlkTableRow
                    key={ilk.key}
                    checked={ilk.key === selectedIlk.key}
                    dispatch={dispatch}
                    ilk={ilk}
                  />
                ))}
              </Table>
            </Flex>
          }
          sideContent={<CDPCreateSelectCollateralSidebar />}
        />
      </Box>
      <ScreenFooter
        dispatch={dispatch}
        canGoBack={false}
        canProgress={!!selectedIlk.key}
      />
    </Box>
  );
};
export default CDPCreateSelectCollateral;
