import { Box } from '@makerdao/ui-components-core';
import { marketingTheme } from 'styles/theme';

import FullWidth from './FullWidth';
import Questions, {
  buildQuestionsFromLangObj,
  QuestionsWrapper
} from './Questions';
import { FilledButton, HollowButton } from './Buttons';
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
import { BorrowCalculator, SaveCalculator } from './Calculators';
import PageHead from './PageHead';
import TokenIcon from './TokenIcon';
import MarketsTable from './MarketsTable';

import PageContentLayout from 'layouts/PageContentLayout';

const ThickUnderline = styled.div`
  background: none;
  display: inline-block;

  :after {
    content: '';
    display: block;
    height: 5px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
    width: 100%;
    position: absolute;
    bottom: 3px;
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

const StyledPageContentLayout = styled(PageContentLayout).attrs(() => ({
  p: { s: `25px ${marketingTheme.mobilePaddingX}`, l: '30px 32px' }
}))``;

export {
  FullWidth,
  Questions,
  QuestionsWrapper,
  buildQuestionsFromLangObj,
  FilledButton,
  HollowButton,
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
  BorrowCalculator,
  SaveCalculator,
  StyledPageContentLayout,
  PageHead,
  TokenIcon,
  MarketsTable
};
