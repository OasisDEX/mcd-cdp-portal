import React from 'react';
import styled from 'styled-components';
import { Box, Text } from '@makerdao/ui-components-core';
import { TextBlock } from '../Typography';

const QuotesBox = (() => {
  const QuotesBoxStyle = styled(Box)`
    background: gray;
    max-width: 980px;
    padding: 100px 100px 148px;
    margin: 0 auto;
    position: relative;
  `;

  const Quote = styled(TextBlock)`
    font-weight: 500;
    font-size: 19px;
    line-height: 30px;
    max-width: 660px;
    margin: 0 auto;
  `;

  const Author = styled(Text)`
    text-decoration: underline;
  `;

  const QuotesImgPos = styled.div`
    position: absolute;
    left: 0;
  `;

  return ({ title, body, quote, author, children, quotesImg, ...props }) => {
    return (
      <QuotesBoxStyle {...props}>
        <Text.h1 mb="16px">{title}</Text.h1>
        <Text>{body}</Text>
        <Box mt="16px">
          <QuotesImgPos>{quotesImg}</QuotesImgPos>
          <Quote>{quote}</Quote>
          <Text>— </Text>
          <Author>{author}</Author>
        </Box>
        {children}
      </QuotesBoxStyle>
    );
  };
})();

export default QuotesBox;
