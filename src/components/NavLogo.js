import MakerLogo from '../images/maker.svg';
import styled from 'styled-components';

const StyledMakerLogo = styled.div`
  display: block;
  cursor: pointer;
  width: 33px;
  height: 21px;
  background: url(${MakerLogo}) center no-repeat;
  margin: 23px auto 32px;
  background-size: 33px;
`;

export default StyledMakerLogo;
