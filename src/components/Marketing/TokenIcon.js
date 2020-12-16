import React from 'react';

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

import { ReactComponent as DefaultIcon } from 'images/oasis-tokens/default.svg';

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
  RENBTC: RenbtcIcon
};

const TokenIcon = ({ symbol, size = 70, ...props }) => {
  const Icon = iconsByToken[symbol.toUpperCase()] || DefaultIcon;

  return <Icon width={size} height={size} {...props} />;
};

export default TokenIcon;
