export const SAFETY_LEVELS = {
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
  FF_VAULT_HISTORY: true,
  FF_DSR_HISTORY: true
};

export const NotificationList = {
  CLAIM_COLLATERAL: { name: 'claimCollateral', priority: 2 },
  NON_VAULT_OWNER: { name: 'nonVaultOwner', priority: 1 },
  NON_OVERVIEW_OWNER: { name: 'nonOverviewOwner', priority: 1 },
  EMERGENCY_SHUTDOWN_ACTIVE: { name: 'emergencyShutdownActive', priority: 1 },
  VAULT_BELOW_NEXT_PRICE: { name: 'vaultBelowNextPrice', priority: 2 },
  VAULT_BELOW_CURRENT_PRICE: { name: 'vaultBelowCurrentPrice', priority: 1 },
  VAULT_IS_LIQUIDATED: { name: 'vaultIsLiquidated', priority: 1 }
};

export const VendorErrors = {
  ENABLE_CONTRACT_DATA: 'EthAppPleaseEnableContractData',
  USER_REJECTED: 'TransportStatusError',
  TIMEOUT: 'TransportError'
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
