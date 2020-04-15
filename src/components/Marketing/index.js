import FullWidth from './FullWidth';
import Questions, { buildQuestionsFromLangObj } from './Questions';
import { FilledButton } from './Buttons';
import ConnectHero from './ConnectHero';
import QuotesBox, { QuotesFadeIn } from './QuotesBox';
import GradientBox from './GradientBox';
import Features from './Features';
import styled from 'styled-components';
import OasisLogoLink from './OasisLogoLink';
import FixedHeaderTrigger from './FixedHeaderTrigger';
import Parallaxed from './Parallaxed';
import FadeIn from './FadeIn';
import { Box } from '@makerdao/ui-components-core';

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

const SeparatorDot = styled(Box)`
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: ${props => props.theme.colors.darkPurple};
  opacity: 0.2;
`;

export {
  FullWidth,
  Questions,
  buildQuestionsFromLangObj,
  FilledButton,
  ConnectHero,
  ThickUnderline,
  SeparatorDot,
  QuotesBox,
  GradientBox,
  QuotesFadeIn,
  Features,
  OasisLogoLink,
  FixedHeaderTrigger,
  Parallaxed,
  FadeIn
};
