import React from 'react';
import {
  Text,
  Box,
  Card,
  Button,
  Flex,
  Grid
} from '@makerdao/ui-components-core';
import useNotification from 'hooks/useNotification';
import { NotificationStatus } from 'utils/constants';
import { ReactComponent as CloseIcon } from 'images/close-simple.svg';
import styled from 'styled-components';
import { getColor } from 'styles/theme';

const StyledCloseIcon = styled(CloseIcon)`
  path {
    stroke: ${props => props.color};
    fill: ${props => props.color};
  }
`;

const ButtonBackgroundWrapper = styled.div`
  background-color: #fff;
  border-radius: 4px;
  width: fit-content;
  height: fit-content;
`;

const getNotificationColors = status => {
  const levels = {
    textColor: '900',
    backgroundColor: '100',
    borderColor: '400'
  };

  const prependColorLevel = color =>
    Object.entries(levels).reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: `${color}.${v}`
      }),
      {}
    );

  switch (status) {
    case NotificationStatus.ERROR:
      return prependColorLevel('orange');
    case NotificationStatus.WARNING:
      return {
        ...prependColorLevel('yellow'),
        textColor: '#826318'
      };
    case NotificationStatus.SUCCESS:
      return prependColorLevel('teal');
    default:
      return prependColorLevel('slate');
  }
};

const ActionButton = ({ onClick, label }) => (
  <ButtonBackgroundWrapper>
    <Button variant="secondary-outline" py="0px" px=".5rem" onClick={onClick}>
      <Text t="smallCaps" fontSize="1rem">
        {label}
      </Text>
    </Button>
  </ButtonBackgroundWrapper>
);

function Notifications() {
  const { banners, viewable, deleteNotifications } = useNotification();
  const bannerEntries =
    banners &&
    Object.entries(banners).sort((a, b) => {
      if (a[1]['priority'] < b[1]['priority']) return -1;
      if (a[1]['priority'] > b[1]['priority']) return 1;
      return 0;
    });
  return (
    <Box mb="l">
      {viewable &&
        !!bannerEntries.length &&
        bannerEntries.map(
          ([
            name,
            { content, status, hasButton, onClick, buttonLabel, customButton }
          ]) => {
            const {
              textColor,
              backgroundColor,
              borderColor
            } = getNotificationColors(status);

            return (
              <Card
                key={name}
                my=".75rem"
                p="1rem"
                bg={backgroundColor}
                borderColor={borderColor}
              >
                <Flex justifyContent="center">
                  <Box px="s" width="100%">
                    <Grid
                      gridTemplateColumns={hasButton ? '1fr auto' : '1fr'}
                      gridColumnGap="m"
                    >
                      <Text color={textColor} justifySelf="center">
                        {content}
                      </Text>
                      <Box justifySelf="start" alignSelf="center">
                        {customButton
                          ? customButton
                          : hasButton && (
                              <ActionButton
                                onClick={onClick}
                                label={buttonLabel}
                              />
                            )}
                      </Box>
                    </Grid>
                  </Box>
                </Flex>
              </Card>
            );
          }
        )}
    </Box>
  );
}

export default Notifications;
