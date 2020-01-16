import React, { useState } from 'react';
import styled from 'styled-components';
import { Box } from '@makerdao/ui-components-core';

const Hideable = styled.div`
  position: relative;
  display: block;

  ${props =>
    props.hide &&
    `
    position: absolute;
    display: none;
    pointer-events: none;
  }`}
`;

const Tabs = ({ header, trackTab, children }) => {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      {React.cloneElement(header, {
        children: React.Children.map(header.props.children, (child, i) => {
          return React.cloneElement(child, {
            onClick: () => {
              setSelected(i);
              if (trackTab && typeof child.props.children === 'string')
                trackTab(child.props.children);
            },
            selected: selected === i
          });
        })
      })}
      <Box position="relative">
        {React.Children.map(children, (child, i) => (
          <Hideable hide={selected !== i}>{child}</Hideable>
        ))}
      </Box>
    </div>
  );
};

export default Tabs;
