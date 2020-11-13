import React, { useEffect } from 'react';
import {
  Text,
  Box,
  Card,
  Button,
  Flex,
  Grid,
  Link
} from '@makerdao/ui-components-core';
import useNotification from 'hooks/useNotification';
import { getSafetyLevels } from 'styles/theme';
import { SAFETY_LEVELS } from 'utils/constants';
import styled from 'styled-components';
import useEmergencyShutdown from 'hooks/useEmergencyShutdown';
import { NotificationList } from 'utils/constants';
import useLanguage from 'hooks/useLanguage';

const ButtonBackgroundWrapper = styled.div`
  background-color: #fff;
  border-radius: 4px;
  width: fit-content;
  height: fit-content;
`;

const ActionButton = ({ onClick, label }) => (
  <ButtonBackgroundWrapper>
    <Button variant="secondary-outline" py="0px" px=".5rem" onClick={onClick}>
      <Text t="smallCaps" fontSize="1rem">
        {label}
      </Text>
    </Button>
  </ButtonBackgroundWrapper>
);

function Globals({ children }) {
  const { addNotification, deleteNotifications } = useNotification();
  const { lang } = useLanguage();

  const {
    emergencyShutdownActive,
    emergencyShutdownTime
  } = useEmergencyShutdown();

  useEffect(() => {
    addNotification({
      id: NotificationList.ALCHEMY_RPC_CHANGE,
      content:
        'The recent issues with Infura have now been resolved. If you are using Metamask, and switched to a custom RPC using our provided Alchemy endpoint, please switch back to Metamask Mainnet as access to our Alchemy endpoint provided will soon be revoked',
      level: SAFETY_LEVELS.WARNING
    });
    if (emergencyShutdownActive) {
      addNotification({
        id: NotificationList.EMERGENCY_SHUTDOWN_ACTIVE,
        content: lang.formatString(
          lang.notifications.emergency_shutdown_active,
          emergencyShutdownTime
            ? `${emergencyShutdownTime.toUTCString().slice(0, -3)} UTC`
            : '--',
          <Link
            css={{ textDecoration: 'underline' }}
            href={'http://migrate.makerdao.com/'}
            target="_blank"
          >
            {'http://migrate.makerdao.com/'}
          </Link>,
          <Link
            css={{ textDecoration: 'underline' }}
            href={'https://forum.makerdao.com/'}
            target="_blank"
          >
            {'here'}
          </Link>
        ),
        level: SAFETY_LEVELS.DANGER
      });
    }

    return () =>
      deleteNotifications([
        NotificationList.EMERGENCY_SHUTDOWN_ACTIVE,
        NotificationList.ALCHEMY_RPC_CHANGE
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emergencyShutdownActive, emergencyShutdownTime]);

  return children;
}

function Notifications() {
  const { banners, viewable } = useNotification();
  const bannerEntries =
    banners &&
    Object.entries(banners).sort((a, b) => {
      if (a[1]['priority'] < b[1]['priority']) return -1;
      if (a[1]['priority'] > b[1]['priority']) return 1;
      return 0;
    });

  return (
    <Globals>
      <Box mb="l">
        {viewable &&
          !!bannerEntries.length &&
          bannerEntries.map(
            ([
              name,
              { content, level, hasButton, onClick, buttonLabel, customButton }
            ]) => {
              const {
                textColor,
                backgroundColor,
                borderColor
              } = getSafetyLevels({
                level,
                overrides:
                  level === SAFETY_LEVELS.WARNING
                    ? { textColor: '#826318' }
                    : undefined
              });
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
                        <Text
                          color={textColor}
                          justifySelf="center"
                          textAlign="center"
                        >
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
    </Globals>
  );
}

export default Notifications;
