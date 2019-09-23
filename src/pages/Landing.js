import React from 'react';
import { hot } from 'react-hot-loader/root';
import Footer, { LangDropdown } from '@makerdao/ui-components-footer';
import Header from '@makerdao/ui-components-header';
import { Link } from 'react-navi';
import { Box, Flex, Card, Text } from '@makerdao/ui-components-core';
import LandingHeroLayout from 'layouts/LandingHeroLayout';
import { Routes } from '../utils/constants';
import { Title } from 'components/Typography';
import { languages } from 'languages';
import useLanguage from 'hooks/useLanguage';

const CardLink = ({ title, link }) => (
  <Box mx="l">
    <Link href={`/${link}`}>
      <Card width="400px" height="250px">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Text.h2>{title}</Text.h2>
          <br />

          {/* Delete below later */}
          <Text.h1>&#10230;</Text.h1>
        </Flex>
      </Card>
    </Link>
  </Box>
);

function Landing() {
  const { locale, setLocale } = useLanguage();

  return (
    <Box width="100%">
      <Header locale={locale} />
      <Box bg="backgroundGrey">
        <LandingHeroLayout>
          <Flex flexDirection="column">
            <Title pb="l" textAlign="center">
              Portal
            </Title>
            <Flex pb="l" flexDirection="row" justifyContent="space-around">
              <CardLink title="Borrow" link={Routes.BORROW} />
              <CardLink title="Save" link={Routes.SAVE} />
            </Flex>
          </Flex>
        </LandingHeroLayout>
      </Box>
      <Footer
        langDropdown={
          <LangDropdown
            languages={languages}
            defaultText="Choose language"
            selectedValue={locale}
            onSelect={(e, value) => setLocale(value)}
          />
        }
        locale={locale}
      />
    </Box>
  );
}

export default hot(Landing);
