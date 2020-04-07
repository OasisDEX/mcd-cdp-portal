import React from 'react';
import { Flex, Grid, Text } from '@makerdao/ui-components-core';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledGrid = styled(Grid)`
  text-align: left;
  max-width: 1120px;
  margin: 0 auto;

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

const Features = ({ features }) => {
  return (
    <StyledGrid
      gridTemplateColumns="1fr 1fr"
      gridRowGap="118px"
      gridColumnGap="120px"
    >
      {features.map(point => (
        <Flex key={point.title}>
          {point.img}
          <Text.h4>{point.title}</Text.h4>
          <Text fontSize="19px">{point.content}</Text>
        </Flex>
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
