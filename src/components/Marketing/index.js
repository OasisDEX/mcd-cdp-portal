import FullWidth from './FullWidth';
import Questions, { buildQuestionsFromLangObj } from './Questions';
import { FilledButton } from './Buttons';
import ConnectHero from './ConnectHero';
import Quotes, { QuotesFadeIn } from './Quotes';
import GradientBox from './GradientBox';
import Features from './Features';
import styled from 'styled-components';
import OasisLogoLink from './OasisLogoLink';
import FixedHeaderTrigger from './FixedHeaderTrigger';
import Parallaxed from './Parallaxed';
import FadeIn from './FadeIn';
import Hamburger from './Hamburger';
import { Box, Text } from '@makerdao/ui-components-core';

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

const H1 = styled(Text.h1)`
  font-size: 5.2rem;

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    font-size: ${props => props.theme.typography.h1.fontSize};
  }
`;

const H2 = styled(Text.h2)`
  font-size: 4rem;

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    font-size: ${props => props.theme.typography.h2.fontSize};
  }
`;

export {
  FullWidth,
  Questions,
  buildQuestionsFromLangObj,
  FilledButton,
  ConnectHero,
  ThickUnderline,
  SeparatorDot,
  Quotes,
  GradientBox,
  QuotesFadeIn,
  Features,
  OasisLogoLink,
  FixedHeaderTrigger,
  Parallaxed,
  FadeIn,
  Hamburger,
  H1,
  H2
};
