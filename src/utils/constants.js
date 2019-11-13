export const CDP_SAFETY_LEVELS = {
  DANGER: 'danger',
  WARNING: 'warning',
  NEUTRAL: 'neutral',
  SAFE: 'safe'
};

export const TxLifecycle = {
  NULL: 'null',
  INITIALIZED: 'initialized',
  PENDING: 'pending',
  MINED: 'mined',
  CONFIRMED: 'confirmed',
  ERROR: 'error'
};

export const AccountTypes = {
  LEDGER: 'ledger',
  TREZOR: 'trezor',
  METAMASK: 'browser',
  WALLETLINK: 'walletlink',
  WALLETCONNECT: 'walletconnect'
};

export const Routes = {
  BORROW: 'borrow',
  SAVE: 'save',
  TRADE: 'trade',
  PRIVACY: 'privacy',
  TERMS: 'terms'
};

export const Toggles = {
  WALLETBALANCES: 'walletbalances'
};

export const FeatureFlags = {
  FF_VAULTHISTORY: true
};

export const NotificationStatus = {
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success'
};

export const NotificationList = {
  CLAIM_COLLATERAL: 'claimCollateral',
  NON_VAULT_OWNER: 'nonVaultOwner'
};
