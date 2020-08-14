import { ReactComponent as CaratDown } from 'images/carat-down.svg';
import styled from 'styled-components';

const Carat = styled(CaratDown)`
  transform: rotate(${props => (props.rotation ? props.rotation : 0)}deg);
  stroke: ${props => props.color || '#9AA3AD'};
`;

export default Carat;
