import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Link, useNavigation } from 'react-navi';
import styled from 'styled-components';
import PageContentLayout from 'layouts/PageContentLayout';
import AccountSelection from 'components/AccountSelection';
import { Routes } from 'utils/constants';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import { Box, Flex, Text } from '@makerdao/ui-components-core';
import {
  ThickUnderline,
  Questions,
  QuestionsWrapper,
  buildQuestionsFromLangObj,
  FixedHeaderTrigger,
  SeparatorDot,
  H1,
  H2
} from 'components/Marketing';
import { ReactComponent as MainImg } from 'images/landing/borrow-wbtc/main.svg';

function Borrow() {
  const { account } = useMaker();
  const navigation = useNavigation();
  const { lang } = useLanguage();

  useEffect(() => {
    async function redirect() {
      if (account) {
        const { search } = (await navigation.getRoute()).url;
        navigation.navigate({
          pathname: `/${Routes.BORROW}/owner/${account.address}`,
          search
        });
      }
    }
    redirect();
  }, [account, navigation]);

  return (
    <PageContentLayout>
      <FixedHeaderTrigger>
        <Flex justifyContent="space-between" pt="18px">
          <Box textAlign="left" maxWidth="535px">
            <ThickUnderline background="linear-gradient(176.36deg, #FFE9E9 26.84%, #FFDB87 97.79%)">
              <Text.h4>{lang.borrow_landing.page_name}</Text.h4>
            </ThickUnderline>
            <H1 className="headline" mt="24px" mb="29px">
              {lang.borrow_wbtc_landing.headline}
            </H1>
            <Box mb="10px" minHeight="90px">
              <Text>{lang.borrow_wbtc_landing.subheadline}</Text>
            </Box>
            <Text fontSize="s" className="connect-to-start">
              {lang.borrow_landing.connect_to_start}
            </Text>
            <AccountSelection
              className="button"
              buttonWidth="248px"
              mt="27px"
            />
          </Box>
          <MainImg />
        </Flex>
      </FixedHeaderTrigger>

      <QuestionsWrapper>
        <H2>{lang.landing_page.questions_title}</H2>
        <Questions
          questions={buildQuestionsFromLangObj(
            lang.borrow_landing.questions,
            lang
          )}
          links={
            <>
              <Link
                href="https://community-development.makerdao.com/makerdao-mcd-faqs/faqs/vault"
                target="_blank"
                rel="noopener noreferrer"
              >
                {lang.borrow_landing.questions.bottom_link1}
              </Link>
              <Box display={{ s: 'none', m: 'inline-block' }}>
                <SeparatorDot mx="24px" />
              </Box>
              <Link
                href="https://community-development.makerdao.com/makerdao-mcd-faqs/faqs/glossary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {lang.borrow_landing.questions.bottom_link2}
              </Link>
            </>
          }
        />
      </QuestionsWrapper>
    </PageContentLayout>
  );
}

export default hot(Borrow);
