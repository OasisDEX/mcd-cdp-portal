import MakerLogo from '../images/maker.svg';
import styled from 'styled-components';

const StyledMakerLogo = styled.div`
  display: block;
  cursor: pointer;
  width: 33px;
  height: 21px;
  background: url(${MakerLogo}) center no-repeat;
  background-size: 33px;
`;

export default StyledMakerLogo;
