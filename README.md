# Oasis Borrow/Save

![Build Workflow](https://github.com/OasisDex/mcd-cdp-portal//actions/workflows/aws-prod.yml/badge.svg)


## The official Maker dapp for managing Vaults and generating Dai

### Prerequisites

Have installed:

- [Git](https://git-scm.com/downloads)
- [Node](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/)

### Installation

1. `git clone https://github.com/makerdao/mcd-cdp-portal.git`

2. `cd mcd-cdp-portal && yarn`

### Running Oasis

- `yarn start`
- Go to http://localhost:3000

For hardware wallet support:

- `HTTPS=true yarn start`
- Go to https://localhost:3000

### Developing with a local testchain

1. Clone either [dai.js](https://github.com/makerdao/dai.js) or the [testchain](https://github.com/makerdao/testchain) repo

2. Start the testchain
   1. If using dai.js, run `yarn && yarn testchain`
   2. If using the testchain repo directly, run `scripts/launch`

3) Navigate to `http://localhost:3000?network=testnet&simplePriceFeeds=1`

_see [this PR](https://github.com/makerdao/mcd-cdp-portal/pull/26) for more details_

[build]: https://circleci.com/gh/makerdao/mcd-cdp-portal.svg?style=svg
[build-url]: https://circleci.com/gh/makerdao/mcd-cdp-portal
[cover]: https://codecov.io/gh/makerdao/mcd-cdp-portal/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/makerdao/mcd-cdp-portal
