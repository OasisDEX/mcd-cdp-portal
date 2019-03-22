import { fromWei } from 'utils/units';
import { TOKEN_BALANCE, TOKEN_UNLOCKED } from 'reducers/network/account';
import { getGemAddress } from 'reducers/addresses';
import { MAX_UINT_BN } from 'utils/units';
import { isEqualTo } from 'utils/bignumber';

export const tokenBalance = addresses => (gem, address) => ({
  target: getGemAddress({ addresses }, gem),
  call: ['balanceOf(address)(uint256)', address],
  returns: [[`${gem}.${TOKEN_BALANCE}`, val => fromWei(val, 5)]],
  type: 'token_balance'
});

export const tokenAllowance = addresses => (gem, address, proxy) => ({
  target: getGemAddress({ addresses }, gem),
  call: ['allowance(address,address)(uint256)', address, proxy],
  returns: [[`${gem}.${TOKEN_UNLOCKED}`, val => isEqualTo(val, MAX_UINT_BN)]],
  type: 'token_allowance'
});
