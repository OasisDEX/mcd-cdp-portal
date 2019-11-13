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
      return prependColorLevel('yellow');
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
  const { banners, viewable, deleteNotification } = useNotification();
  const bannerEntries = banners && Object.entries(banners);
  return (
    <div>
      {viewable &&
        !!bannerEntries.length &&
        bannerEntries.map(
          ([
            id,
            {
              content,
              textAlign,
              status,
              hasButton,
              onClick,
              buttonLabel,
              customButton,
              onClose,
              showCloseButton
            }
          ]) => {
            const {
              textColor,
              backgroundColor,
              borderColor
            } = getNotificationColors(status);

            return (
              <Card
                key={id}
                my=".75rem"
                p="1rem"
                width="100%"
                bg={backgroundColor}
                borderColor={borderColor}
              >
                <Grid gridTemplateColumns="1fr 20px">
                  <Flex width="100%" justifyContent={textAlign}>
                    <Text color={textColor} mr="s" alignSelf="center">
                      {content}
                    </Text>
                    {customButton
                      ? customButton
                      : hasButton && (
                          <ActionButton onClick={onClick} label={buttonLabel} />
                        )}
                  </Flex>
                  {showCloseButton && (
                    <Flex justifyContent="flex-end">
                      <Box
                        onClick={() => {
                          deleteNotification(id);
                          if (onClose) onClose();
                        }}
                      >
                        <StyledCloseIcon
                          width={12}
                          height={12}
                          color={getColor(textColor)}
                        />
                      </Box>
                    </Flex>
                  )}
                </Grid>
              </Card>
            );
          }
        )}
    </div>
  );
}

export default Notifications;
