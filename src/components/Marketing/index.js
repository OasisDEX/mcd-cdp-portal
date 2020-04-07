import FullWidth from './FullWidth';
import Questions, { buildQuestionsFromLangObj } from './Questions';
import { FilledButton, HollowButton } from './Buttons';
import ConnectHero from './ConnectHero';
import styled from 'styled-components';

const ThickUnderline = styled.div`
  background: none;
  :after {
    content: '';
    display: block;
    height: 7px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: -1;
    background: ${props => props.background};
  }
`;

export {
  FullWidth,
  Questions,
  buildQuestionsFromLangObj,
  FilledButton,
  HollowButton,
  ConnectHero,
  ThickUnderline
};
