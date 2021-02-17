import React from 'react';

import styled from 'styled-components';

import { ReactComponent as BatIcon } from 'images/oasis-tokens/bat.svg';
import { ReactComponent as CompIcon } from 'images/oasis-tokens/comp.svg';
import { ReactComponent as DaiIcon } from 'images/oasis-tokens/dai.svg';
import { ReactComponent as EthIcon } from 'images/oasis-tokens/eth.svg';
import { ReactComponent as KncIcon } from 'images/oasis-tokens/knc.svg';
import { ReactComponent as LinkIcon } from 'images/oasis-tokens/link.svg';
import { ReactComponent as LrcIcon } from 'images/oasis-tokens/lrc.svg';
import { ReactComponent as ManaIcon } from 'images/oasis-tokens/mana.svg';
import { ReactComponent as PaxIcon } from 'images/oasis-tokens/pax.svg';
import { ReactComponent as TusdIcon } from 'images/oasis-tokens/tusd.svg';
import { ReactComponent as UsdcIcon } from 'images/oasis-tokens/usdc.svg';
import { ReactComponent as WbtcIcon } from 'images/oasis-tokens/wbtc.svg';
import { ReactComponent as ZrxIcon } from 'images/oasis-tokens/zrx.svg';
import { ReactComponent as UsdtIcon } from 'images/oasis-tokens/usdt.svg';
import { ReactComponent as YfiIcon } from 'images/oasis-tokens/yfi.svg';
import { ReactComponent as BalIcon } from 'images/oasis-tokens/bal.svg';
import { ReactComponent as GusdIcon } from 'images/oasis-tokens/gusd.svg';
import { ReactComponent as UniIcon } from 'images/oasis-tokens/uni.svg';
import { ReactComponent as RenbtcIcon } from 'images/oasis-tokens/renbtc.svg';
import { ReactComponent as AaveIcon } from 'images/oasis-tokens/aave.svg';

import { ReactComponent as DefaultIcon } from 'images/oasis-tokens/default.svg';
import { ReactComponent as UniPairStamp } from 'images/oasis-tokens/uni-pair-stamp.svg';

import { parseUniPair } from 'utils/ui';

const iconsByToken = {
  BAT: BatIcon,
  COMP: CompIcon,
  DAI: DaiIcon,
  ETH: EthIcon,
  KNC: KncIcon,
  LINK: LinkIcon,
  LRC: LrcIcon,
  MANA: ManaIcon,
  PAX: PaxIcon,
  PAXUSD: PaxIcon,
  TUSD: TusdIcon,
  USDC: UsdcIcon,
  WBTC: WbtcIcon,
  ZRX: ZrxIcon,
  USDT: UsdtIcon,
  YFI: YfiIcon,
  BAL: BalIcon,
  GUSD: GusdIcon,
  UNI: UniIcon,
  RENBTC: RenbtcIcon,
  AAVE: AaveIcon
};

const UniPairIconStyle = styled.div`
  display: inline-block;
  position: relative;

  .base,
  .quote {
    width: 66.6%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .base {
    z-index: 2;
    left: 0;
  }

  .quote {
    z-index: 1;
    right: 0;
  }

  .stamp {
    position: absolute;
    top: -5%;
    right: -15%;
    z-index: 3;
  }
`;

const UniPairIcon = ({ pair, size }) => {
  const scaleUniStamp = 0.42;
  const BaseIcon = iconsByToken[pair[0]];
  const QuoteIcon = iconsByToken[pair[1]];

  return (
    <UniPairIconStyle style={{ height: `${size}px`, width: `${size}px` }}>
      <BaseIcon className="base" />
      <QuoteIcon className="quote" />
      <UniPairStamp
        className="stamp"
        width={size * scaleUniStamp}
        height={size * scaleUniStamp}
      />
    </UniPairIconStyle>
  );
};

const TokenIcon = ({ symbol, size = 70, ...props }) => {
  const uniPair = parseUniPair(symbol, Object.keys(iconsByToken));
  if (uniPair) {
    return <UniPairIcon pair={uniPair} size={size} />;
  }
  const Icon = iconsByToken[symbol.toUpperCase()] || DefaultIcon;

  return <Icon width={size} height={size} {...props} />;
};

export default TokenIcon;
