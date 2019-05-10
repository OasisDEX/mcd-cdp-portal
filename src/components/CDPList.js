import React, { memo, Fragment, useEffect } from 'react';
import styled from 'styled-components';
// import { ReactComponent as MakerSmall } from '../images/maker-small.svg';
import { ReactComponent as Plus } from '../images/plus.svg';
import { Flex, Text } from '@makerdao/ui-components-core';
import RatioDisplay from './RatioDisplay';
import { Link } from 'react-navi';
import useModal from 'hooks/useModal';
import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';
import { fetchCdps } from 'reducers/cdps';

const NavbarItemContainer = styled(Link)`
  display: block;
`;

const DashedFakeButton = styled(Flex)`
  border: 1px dashed;
  cursor: pointer;
  border-color: ${({ theme }) => theme.colors.blackLighter};
`;

const NavbarItem = ({ href, label, ratio, owned, active, ...props }) => (
  <NavbarItemContainer href={href} active={active} prefetch={true} {...props}>
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg={active ? 'teal.500' : owned ? 'blackLighter' : 'grey.200'}
      borderRadius="default"
      height="50px"
    >
      <Text t="p6" fontWeight="bold" color={owned ? 'white' : 'darkPurple'}>
        {label}
      </Text>
      <RatioDisplay ratio={ratio} active={active} />
    </Flex>
  </NavbarItemContainer>
);

const CDPList = memo(function({ currentPath, viewedAddress, currentQuery }) {
  const { maker, account } = useMaker();
  const [{ cdps }, dispatch] = useStore();

  useEffect(() => {
    (async () => {
      const address = account ? account.address : viewedAddress;
      const action = await fetchCdps(maker, address);
      dispatch(action);
    })();
  }, [maker, viewedAddress, account]);

  const { show } = useModal();

  return (
    <Fragment>
      {/* <NavbarItem
        key="overview"
        href={`/owner/${currentQuery}`}
        label="Overview"
        active={currentPath.includes('/overview/')}
      /> */}
      {cdps.items.map((cdp, idx) => {
        const linkPath = `/${cdp.cdp.id}`;
        const active = currentPath === linkPath;
        return (
          <NavbarItem
            key={idx}
            href={linkPath + currentQuery}
            label={cdp.cdp.ilk}
            owned={account}
            active={active}
          />
        );
      })}
      {!account ? null : (
        <DashedFakeButton
          onClick={() =>
            show({ modalType: 'cdpcreate', modalTemplate: 'fullscreen' })
          }
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
