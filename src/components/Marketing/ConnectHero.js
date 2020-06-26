import styled from 'styled-components';
import { Flex } from '@makerdao/ui-components-core';

const ConnectHero = styled(Flex)`
  flex-direction: column;
  align-items: center;
  max-width: 866px;
  margin: 64px auto 0;
  padding: 0 10px;

  .headline {
    margin-top: 7px;
    margin-bottom: 24px;
  }

  .connect-to-start {
    margin-top: 58px;
  }

  .button {
    margin-top: 24px;
    margin-bottom: 8px;
  }

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    margin-top: 130px;

    .headline {
      margin-top: 16px;
      margin-bottom: 15px;
    }

    .button {
      margin-top: 12px;
    }
  }
`;

export default ConnectHero;
