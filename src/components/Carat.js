import { ReactComponent as CaratDown } from 'images/carat-down.svg';
import styled from 'styled-components';

const Carat = styled(CaratDown)`
  transform: rotate(${props => (props.rotation ? props.rotation : 0)}deg);
`;

export default Carat;
