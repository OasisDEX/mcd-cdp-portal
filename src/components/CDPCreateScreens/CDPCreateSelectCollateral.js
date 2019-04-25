import React from 'react';
import { Box, Grid, Table, Flex, Radio } from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import TwoColumnCardsLayout from 'layouts/TwoColumnCardsLayout';
import { connect } from 'react-redux';

import { prettifyNumber } from 'utils/ui';
import ilkList from 'references/ilkList';
import { getIlkData } from 'reducers/network/cdpTypes';

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
          <TextBlock t="h5" lineHeight="normal">
            {title}
          </TextBlock>
          <TextBlock t="body">{text}</TextBlock>
        </Grid>
      ))}
    </Box>
  </Box>
);

function IlkTableRowView({ ilk, checked, dispatch }) {
  const { maker } = useMaker();
  const [userGemBalance, setUserGemBalance] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      setUserGemBalance(await maker.getToken(ilk.currency).balance());
    })();
  }, []);

  return (
    <Table.tbody borderBottom="1px solid" borderColor="grey.200">
      <tr>
        <td>
          <Radio
            checked={checked}
            onClick={() =>
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
    </Table.tbody>
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

const CDPCreateSelectCollateral = ({ selectedIlk, dispatch }) => {
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
                {ilkList.map(ilk => (
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
