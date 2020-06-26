import React from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';
import { Box, Text } from '@makerdao/ui-components-core';
import { TextBlock } from '../Typography';
import { Link } from 'react-navi';
import FadeIn from './FadeIn';

const QuotesStyle = styled(Box)`
  background: gray;
  max-width: 980px;
  padding: 100px 24px 53px;
  margin: 0 auto;
  position: relative;
  width: 100vw;
  left: -${props => props.theme.mobilePaddingX};

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    width: unset;
    left: unset;
    padding: 100px 9.1% 76px;
  }
`;

const QuotesImgWrapper = styled.div`
  padding-top: 10px;
  justify-self: left;
`;

const QuoteWrapper = styled(Box)`
  margin: 51px auto;
  ${QuotesImgWrapper} {
    margin-bottom: 21px;
  }

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    margin: 48px auto;
    display: grid;
    grid-template-columns: 44px auto 44px;
    grid-column-gap: 7px;
    max-width: 760px;
  }
`;

const Quote = styled(TextBlock)`
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.05px;
`;

const Author = styled(Text).attrs(() => ({
  fontSize: 's'
}))`
  margin-top: 16px;
  .author-link {
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
    <QuotesStyle {...props}>
      <Text.h2 mb="16px">{title}</Text.h2>
      <Text>{body}</Text>
      <QuoteWrapper>
        <QuotesImgWrapper>{quotesImg}</QuotesImgWrapper>
        <div>
          <Quote>“{quote}”</Quote>
          <Author as="div">
            <span>— </span>
            {url ? (
              <Link className="author-link" href={url}>
                {author}
              </Link>
            ) : (
              <span>{author}</span>
            )}
          </Author>
        </div>
        <div />
      </QuoteWrapper>
      {children}
    </QuotesStyle>
  );
};

export const QuotesFadeIn = ({ children, ...props }) => (
  <FadeIn triggerOffset={100} moveDistance="80px" {...props}>
    {children}
  </FadeIn>
);

export default hot(Quotes);
