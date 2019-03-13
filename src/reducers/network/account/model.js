import { fromWei } from 'utils/units';
import { ACCOUNT_TOKEN_BALANCE } from 'reducers/network/account';

export const accountTokenBalance = addresses => (key, address) => ({
  target: addresses[`TOKEN_${key}`],
  call: ['balanceOf(address)(uint256)', address],
  returns: [[`${key}.${ACCOUNT_TOKEN_BALANCE}`, val => fromWei(val, 5)]],
  type: 'wallet_token_balance'
});
