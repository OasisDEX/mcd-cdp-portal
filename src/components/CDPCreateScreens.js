import React from 'react';
import {
  Box,
  Button,
  Grid,
  Text,
  Input,
  Table,
  Flex,
  Card,
  Checkbox
} from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import TwoColumnCardsLayout from 'layouts/TwoColumnCardsLayout';

import { connect } from 'react-redux';
import { getIlkData } from 'reducers/network/cdpTypes';
import { prettifyNumber } from 'utils/ui';
import LoadingLayout from 'layouts/LoadingLayout';

import useMaker from 'hooks/useMaker';

const ScreenHeader = ({ title, text }) => {
  return (
    <Box textAlign="center" py="m">
      <Box pb="xs">
        <TextBlock t="headingL">{title}</TextBlock>
      </Box>
      <TextBlock t="textL" color="gray2">
        {text}
      </TextBlock>
    </Box>
  );
};

const ScreenFooter = ({ dispatch, loading, canProgress = true } = {}) => {
  return (
    <Flex textAlign="center" justifyContent="center">
      <Button
        width="110px"
        variant="secondary-outline"
        mx="xs"
        onClick={() => dispatch({ type: 'decrement-step' })}
      >
        Back
      </Button>
      <Button
        disabled={!canProgress}
        loading={loading}
        width="145px"
        mx="xs"
        onClick={() => dispatch({ type: 'increment-step' })}
      >
        Continue
      </Button>
    </Flex>
  );
};

const CDPCreateSelectCollateralSidebar = () => (
  <Box p="m">
    <TextBlock t="headingS" fontWeight="medium">
      Risk Parameters
    </TextBlock>
    <Box mt="m">
      {[
        [
          'Stability Fee',
          'The fee calculated on top of the existing debt of the CDP. This is paid when paying back Dai.'
        ],
        [
          'Liquidation Ratio',
          'The collateral-to-dai ratio at which a CDP becomes vulnerable to liquidation. '
        ],
        [
          'Liquidation Fee',
          'The fee that is added to the total outstanding DAI debt when a liquidation occurs.'
        ]
      ].map(([title, text]) => (
        <Box mb="m" key={title}>
          <TextBlock t="textM" fontWeight="medium">
            {title}
          </TextBlock>
          <TextBlock t="textS" color="black3">
            {text}
          </TextBlock>
        </Box>
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
    <tbody>
      <tr>
        <td>
          <Checkbox
            checked={checked}
            onChange={() =>
              dispatch({
                type: 'set-ilk',
                payload: { key: ilk.key, gemBalance: userGemBalance.toNumber() }
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
      data: getIlkData(state, ilk.slug)
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
        title="Select a collateral type"
        text="Each collateral type has its own risk parameters. You can lock up additional collateral types later."
      />
      <Box my="l">
        <TwoColumnCardsLayout
          ratio={[3, 1]}
          mainContent={
            <Flex justifyContent="center" p="m">
              <Table width="700px">
                <thead>
                  <tr>
                    <th />
                    <th>Collateral Type</th>
                    <th>Stability Fee</th>
                    <th>Liq Ratio</th>
                    <th>Liq Fee</th>
                    <th>Your Balance</th>
                  </tr>
                </thead>
                {actionableIlks.map(({ slug, key, gem, symbol }) => (
                  <IlkTableRow
                    key={key}
                    checked={key === selectedIlk.key}
                    dispatch={dispatch}
                    ilk={{ symbol, slug, key, gem }}
                  />
                ))}
              </Table>
            </Flex>
          }
          sideContent={<CDPCreateSelectCollateralSidebar />}
        />
      </Box>
      <ScreenFooter dispatch={dispatch} canProgress={!!selectedIlk.key} />
    </Box>
  );
};

function OpenCDPForm({ selectedIlk, cdpParams, handleInputChange }) {
  const userHasSufficientGemBalance =
    parseFloat(selectedIlk.userGemBalance) >= parseFloat(cdpParams.gemsToLock);
  return (
    <Grid gridRowGap="l" p="m" width={500} maxWidth="100%">
      <h3>Deposit Ethereum and Generate Dai</h3>
      <Grid
        gridTemplateColumns="auto"
        gridRowGap="m"
        gridColumnGap="m"
        alignItems="center"
      >
        <Flex flexDirection="column">
          <Text>
            How much {selectedIlk.key} would you like to lock in your CDP?
          </Text>
          <Input
            name="gemsToLock"
            after={selectedIlk.key}
            type="number"
            value={cdpParams.gemsToLock}
            onChange={handleInputChange}
            errorMessage={
              userHasSufficientGemBalance || !cdpParams.gemsToLock
                ? null
                : `Insufficient ${selectedIlk.key} balance`
            }
          />
          <Text>
            You currently have {selectedIlk.userGemBalance} {selectedIlk.key}
          </Text>
        </Flex>

        <Flex flexDirection="column">
          <Text>
            What target collateralization ratio would you like to stay above?
          </Text>
          <Input
            name="targetCollateralizationRatio"
            after="%"
            type="number"
            value={cdpParams.targetCollateralizationRatio}
            onChange={handleInputChange}
          />
        </Flex>

        <Flex flexDirection="column">
          <Text>How much DAI would you like to generate?</Text>
          <Input
            name="daiToDraw"
            after="DAI"
            type="number"
            value={cdpParams.daiToDraw}
            onChange={handleInputChange}
          />
        </Flex>
      </Grid>
    </Grid>
  );
}

function cdpParamsAreValid({ gemsToLock, daiToDraw }, userGemBalance) {
  if (parseFloat(gemsToLock) > parseFloat(userGemBalance)) return false;
  return !!gemsToLock && !!daiToDraw;
}

const CDPCreateDeposit = ({ selectedIlk, cdpParams, dispatch }) => {
  function handleInputChange({ target }) {
    dispatch({
      type: `form/set-${target.name}`,
      payload: { value: target.value }
    });
  }

  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <ScreenHeader
        title="Deposit Ethereum and Generate Dai"
        text="Different collateral types have different risk parameters and collateralization ratios."
      />
      <Box my="l">
        <TwoColumnCardsLayout
          mainContent={
            <OpenCDPForm
              cdpParams={cdpParams}
              handleInputChange={handleInputChange}
              selectedIlk={selectedIlk}
            />
          }
          ratio={[4, 2]}
          sideContent={<CDPCreateSelectCollateralSidebar />}
          SidebarComponent={Box}
        />
      </Box>
      <ScreenFooter
        dispatch={dispatch}
        canProgress={cdpParamsAreValid(cdpParams, selectedIlk.userBalance)}
      />
    </Box>
  );
};

const CDPCreateConfirmCDP = ({ dispatch, cdpParams, selectedIlk }) => {
  const { maker } = useMaker();
  const [userProxyDetails, setUserProxyDetails] = React.useState({
    status: 'null',
    address: ''
  });

  async function checkProxyStatus() {
    setUserProxyDetails({ status: 'checking', address: '' });
    const proxyAddress = await maker.service('proxy').currentProxy();
    if (!proxyAddress)
      setUserProxyDetails({
        status: 'no-proxy',
        address: ''
      });
    else
      setUserProxyDetails({
        address: proxyAddress,
        status: 'found'
      });
  }

  React.useEffect(() => {
    checkProxyStatus();
  }, []);

  const showLoader = userProxyDetails.status === 'checking';
  if (showLoader) return <LoadingLayout background="#F6F8F9" />;

  if (userProxyDetails.status === 'no-proxy')
    return (
      <Box>
        <ScreenHeader
          title="Creating a proxy"
          text="Before creating your first CDP, you must create a personal proxy contract."
        />
      </Box>
    );

  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <ScreenHeader title="Confirm CDP" />
      <Box my="l">
        <Card>
          <Box m="l">
            <Text>
              Depositing {cdpParams.gemsToLock} {selectedIlk.key}
            </Text>
          </Box>
          <Box m="l">
            <Text>Generating {cdpParams.daiToDraw} DAI</Text>
          </Box>
        </Card>
      </Box>
      <ScreenFooter dispatch={dispatch} />
    </Box>
  );
};

export { CDPCreateSelectCollateral, CDPCreateConfirmCDP, CDPCreateDeposit };
