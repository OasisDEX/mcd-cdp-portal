import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Link, useNavigation } from 'react-navi';
import styled from 'styled-components';
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
  StyledPageContentLayout
} from 'components/Marketing';
import { TextBlock } from 'components/Typography';
import { ReactComponent as MainImg } from 'images/landing/borrow-wbtc/main.svg';
import { ReactComponent as Step1Img } from 'images/landing/borrow-wbtc/step1.svg';
import { ReactComponent as Step2Img } from 'images/landing/borrow-wbtc/step2.svg';
import { ReactComponent as Step3Img } from 'images/landing/borrow-wbtc/step3.svg';
import { ReactComponent as Step4Img } from 'images/landing/borrow-wbtc/step4.svg';
import { ReactComponent as Step5Img } from 'images/landing/borrow-wbtc/step5.svg';

const StepNumber = styled(Box)`
  background: #ffeec5;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StepStyle = styled(Flex)`
  .img {
    transform: scale(0.8);
    width: 460px;
    margin: 0 auto;

    @media (min-width: ${props => props.theme.breakpoints.l}) {
      transform: scale(0.9);
    }

    @media (min-width: ${props => props.theme.breakpoints.xl}) {
      transform: unset;
    }
  }
`;

const Step = ({ number, title, details, Img, ...props }) => {
  const numberCircleSize = '56px';

  return (
    <StepStyle
      justifyContent="start"
      flexDirection={{ s: 'column', l: 'row' }}
      alignItems="center"
      mt={{ s: '82px', l: '136px' }}
      {...props}
    >
      <Flex
        height="210px"
        width={{ s: '350px', xl: '460px' }}
        alignItems="center"
        justifyContent="center"
      >
        <Img className="img" width="460px" />
      </Flex>
      <Flex
        textAlign={{ s: 'center', l: 'left' }}
        flexDirection={{ s: 'column', l: 'row' }}
        ml={{ l: '30px', xl: '65px' }}
        flexShrink={1}
      >
        <StepNumber
          width={numberCircleSize}
          height={numberCircleSize}
          m={{ s: '35px auto 11px', l: 'unset' }}
        >
          <Text.h4>{number}</Text.h4>
        </StepNumber>
        <Box
          px={{ s: '10px', l: 'unset' }}
          m={{ s: '13px 0 0', l: '12px 0 0 36px' }}
          flexShrink={1}
          maxWidth={{ s: '470px', l: '509px' }}
        >
          <Flex
            alignItems="center"
            justifyContent={{ s: 'center', l: 'start' }}
            mb="17px"
            textAlign={{ s: 'center', l: 'left' }}
          >
            <Text.h4 style={{ flexShrink: 1 }}>{title}</Text.h4>
          </Flex>
          <Box textAlign={{ s: 'center', l: 'left' }}>
            <Text fontSize="s" letterSpacing={0} lineHeight="31px">
              {details}
            </Text>
          </Box>
        </Box>
      </Flex>
    </StepStyle>
  );
};

const ExternalLink = ({ children, ...props }) => (
  <a
    {...props}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: 'underline', ...props.style }}
  >
    {children}
  </a>
);

const HeroStyle = styled(Flex)`
  justify-content: space-between;

  flex-direction: column-reverse;
  margin-top: -39px;

  .content {
    text-align: center;
    padding-top: 45px;
    padding-left: 10px;
    padding-right: 10px;

    .headline {
      margin-top: 7px;
      margin-bottom: 24px;
    }

    .subheadline {
      margin-bottom: 59px;
    }
  }

  .img {
    width: 100vw;
    left: -12px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .button {
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: ${props => props.theme.breakpoints.l}) {
    margin-top: 0;
    flex-direction: row;
    padding-top: 18px;
    align-items: start;

    .content {
      text-align: left;
      max-width: 547px;
      padding-left: 0;
      padding-right: 12px;
      padding-top: 0;
      flex-shrink: 1;

      .headline {
        margin-top: 24px;
        margin-bottom: 29px;
      }

      .subheadline {
        margin-bottom: 10px;
      }
    }

    .img {
      width: unset;
      left: unset;
      flex-shrink: 1;
    }

    .button {
      margin-left: unset;
      margin-right: unset;
    }
  }
`;

function BorrowWBTCLanding() {
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
    <StyledPageContentLayout>
      <FixedHeaderTrigger>
        <HeroStyle>
          <Box className="content">
            <ThickUnderline background="linear-gradient(176.36deg, #FFE9E9 26.84%, #FFDB87 97.79%)">
              <Text.h4>{lang.borrow_landing.page_name}</Text.h4>
            </ThickUnderline>
            <Text.h1 className="headline">
              {lang.borrow_wbtc_landing.headline}
            </Text.h1>
            <Box className="subheadline">
              <Text>{lang.borrow_wbtc_landing.subheadline}</Text>
            </Box>
            <Text fontSize="s" className="connect-to-start">
              {lang.borrow_landing.connect_to_start}
            </Text>
            <AccountSelection className="button" mt="27px" />
          </Box>
          <Box className="img">
            <MainImg />
          </Box>
        </HeroStyle>
      </FixedHeaderTrigger>
      <Box maxWidth="790px" m="180px auto">
        <Text.h2 style={{ marginBottom: '20px' }}>
          {lang.borrow_wbtc_landing.about_title}
        </Text.h2>
        <TextBlock>{lang.borrow_wbtc_landing.about_content}</TextBlock>
        <Text>
          {lang.formatString(lang.borrow_wbtc_landing.about_learn_more, {
            link: (
              <ExternalLink href="https://www.wbtc.network/">
                https://www.wbtc.network/
              </ExternalLink>
            )
          })}
        </Text>
      </Box>
      <Box>
        <Step
          number={1}
          title={lang.borrow_wbtc_landing.step1}
          details={lang.formatString(lang.borrow_wbtc_landing.step1_details, {
            link: (
              <ExternalLink href="https://coinlist.co/wbtc-signup?referral_code=FETRCM">
                CoinList
              </ExternalLink>
            )
          })}
          Img={Step1Img}
        />
        <Step
          number={2}
          title={lang.borrow_wbtc_landing.step2}
          details={lang.borrow_wbtc_landing.step2_details}
          Img={Step2Img}
        />
        <Step
          number={3}
          title={lang.borrow_wbtc_landing.step3}
          details={lang.borrow_wbtc_landing.step3_details}
          Img={Step3Img}
        />
        <Step
          number={4}
          title={lang.borrow_wbtc_landing.step4}
          details={lang.borrow_wbtc_landing.step4_details}
          Img={Step4Img}
        />
        <Step
          number={5}
          title={lang.borrow_wbtc_landing.step5}
          details={lang.formatString(lang.borrow_wbtc_landing.step5_details, {
            link: (
              <Link
                style={{ textDecoration: 'underline' }}
                href={`/${Routes.BORROW}`}
              >
                {lang.borrow_wbtc_landing.step5_link_text}
              </Link>
            )
          })}
          Img={Step5Img}
        />
      </Box>
      <QuestionsWrapper mt={{ s: '159px', m: '250px' }}>
        <Text.h2>{lang.landing_page.questions_title}</Text.h2>
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
    </StyledPageContentLayout>
  );
}

export default hot(BorrowWBTCLanding);
