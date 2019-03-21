import React, { memo, Fragment } from 'react';
import styled from 'styled-components';
import ilks from 'references/ilks';
import { ReactComponent as MakerSmall } from '../images/maker-small.svg';
import { ReactComponent as Plus } from '../images/plus.svg';
import { Flex } from '@makerdao/ui-components-core';
import RatioDisplay from './RatioDisplay';
import { NavLink } from 'react-navi';
import { NavLabel } from 'components/Typography';
import useModal from 'hooks/useModal';

const shownIlks = ilks.map(cdpType => ({
  ...cdpType,
  ratio: (Math.random() * 1000).toFixed(2)
}));

const NavbarItemContainer = styled(NavLink)`
  display: block;
`;

const DashedFakeButton = styled(Flex)`
  border: 1px dashed;
  cursor: pointer;
  border-color: ${({ theme }) => theme.colors.blackLight};
`;

const NavbarItem = ({ href, label, ratio, active, ...props }) => (
  <NavbarItemContainer href={href} active={active} precache={true} {...props}>
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg={active ? 'greenPastel' : 'blackLight'}
      borderRadius="4px"
      height="50px"
    >
      <NavLabel t="p6">{label}</NavLabel>
      <RatioDisplay ratio={ratio} active={active} />
    </Flex>
  </NavbarItemContainer>
);

const CDPList = memo(function({ currentPath, currentQuery, address }) {
  const { showFullscreenByType } = useModal();

  return (
    <Fragment>
      <NavbarItem
        key="overview"
        href={`/overview/${currentQuery}`}
        label="Overview"
        Logo={MakerSmall}
        active={currentPath.includes('/overview/')}
      />
      {shownIlks.map((cdp, idx) => {
        const linkPath = `/cdp/${cdp.slug}/`;
        const active = currentPath.includes(linkPath);
        return (
          <NavbarItem
            key={idx}
            href={linkPath + currentQuery}
            label={cdp.symbol}
            ratio={cdp.ratio}
            active={active}
            cdpKey={cdp.key}
          />
        );
      })}
      {!address ? null : (
        <DashedFakeButton
          onClick={() => showFullscreenByType('cdpcreate')}
          justifyContent="center"
          borderRadius="4px"
          py="s"
        >
          <Plus />
        </DashedFakeButton>
      )}
    </Fragment>
  );
});

export default CDPList;
