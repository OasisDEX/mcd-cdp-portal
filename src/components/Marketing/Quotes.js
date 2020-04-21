import React from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';
import { Box, Text } from '@makerdao/ui-components-core';
import { TextBlock } from '../Typography';
import { Link } from 'react-navi';
import FadeIn from './FadeIn';
import { H2 } from './index';

const QuotesBoxStyle = styled(Box)`
  background: gray;
  max-width: 980px;
  padding: 100px 9.1% 76px;
  margin: 0 auto;
  position: relative;
  width: 100vw;
  left: -12px;

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    width: unset;
    left: unset;
  }
`;

const QuoteWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 50px auto 50px;
  grid-column-gap: 7px;
  max-width: 760px;
  margin: 48px auto;
`;

const QuotesImgWrapper = styled.div`
  padding-top: 10px;
  justify-self: left;
`;

const Quote = styled(TextBlock).attrs(() => ({
  fontSize: 's'
}))`
  font-weight: bold;
  line-height: 30px;
`;

const Author = styled(Text).attrs(() => ({
  fontSize: 's'
}))`
  margin-top: 16px;
  .name {
    text-decoration: underline;
  }
`;

const Quotes = ({
  title,
  body,
  quote,
  author,
  url,
  children,
  quotesImg,
  ...props
}) => {
  return (
    <QuotesBoxStyle {...props}>
      <H2 mb="16px">{title}</H2>
      <Text>{body}</Text>
      <QuoteWrapper>
        <QuotesImgWrapper>{quotesImg}</QuotesImgWrapper>
        <div>
          <Quote>“{quote}”</Quote>
          <Author as="div">
            <span>— </span>
            <Link className="name" href={url}>
              {author}
            </Link>
          </Author>
        </div>
        <div />
      </QuoteWrapper>
      {children}
    </QuotesBoxStyle>
  );
};

export const QuotesFadeIn = ({ children, ...props }) => (
  <FadeIn triggerOffset={100} moveDistance="80px" {...props}>
    {children}
  </FadeIn>
);

export default hot(Quotes);
