import React from 'react';
import styled from 'styled-components';
import { Box, Text } from '@makerdao/ui-components-core';
import { TextBlock } from '../Typography';

const QuotesBox = (() => {
  const QuotesBoxStyle = styled(Box)`
    background: gray;
    max-width: 980px;
    padding: 100px 10.2% 138px;
    margin: 0 auto;
    position: relative;
  `;

  const QuoteWrapper = styled(Box)`
    display: grid;
    grid-template-columns: 50px auto 50px;
    grid-column-gap: 7px;
    max-width: 760px;
    margin: 14px auto;
  `;

  const QuotesImgWrapper = styled.div`
    padding-top: 10px;
    justify-self: left;
  `;

  const Quote = styled(TextBlock)`
    font-weight: bold;
    font-size: 19px;
    line-height: 30px;
  `;

  const Author = styled(Text)`
    line-height: 10px;
    font-size: 19px;
    .name {
      text-decoration: underline;
    }
  `;

  return ({ title, body, quote, author, children, quotesImg, ...props }) => {
    return (
      <QuotesBoxStyle {...props}>
        <Text.h2 mb="16px">{title}</Text.h2>
        <Text>{body}</Text>
        <QuoteWrapper>
          <QuotesImgWrapper>{quotesImg}</QuotesImgWrapper>
          <div>
            <Quote>“{quote}”</Quote>
            <Author>
              <span>— </span>
              <span className="name">{author}</span>
            </Author>
          </div>
          <div />
        </QuoteWrapper>
        {children}
      </QuotesBoxStyle>
    );
  };
})();

export default QuotesBox;
