import React from 'react';
import { Flex, Grid, Text } from '@makerdao/ui-components-core';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FadeIn from './FadeIn';

const StyledGrid = styled(Grid)`
  text-align: left;
  margin-left: auto;
  margin-right: auto;

  ${Flex} {
    flex-direction: column;
  }
  ${Text.h4} {
    margin: 22px 0 15px;
  }
  ${Text} {
    display: block;
  }
`;

const Features = ({ features, ...props }) => {
  return (
    <StyledGrid
      gridTemplateColumns={{ s: '1fr', l: '1fr 1fr' }}
      maxWidth={{ s: '500px', l: '1120px' }}
      gridRowGap="118px"
      gridColumnGap="120px"
      {...props}
    >
      {features.map(point => (
        <FadeIn key={point.title} triggerOffset={160} moveDistance="25%">
          <Flex>
            {point.img}
            <Text.h4>{point.title}</Text.h4>
            <Text fontSize="19px">{point.content}</Text>
          </Flex>
        </FadeIn>
      ))}
    </StyledGrid>
  );
};

Features.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.shape({
      img: PropTypes.any,
      title: PropTypes.any,
      content: PropTypes.any
    })
  )
};

export default Features;
