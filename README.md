# CDP Portal for MCD

[![Build Status](https://travis-ci.com/makerdao/mcd-cdp-portal.svg?token=3BTQxsyAmYGZyiaheNXp&branch=master)](https://travis-ci.com/makerdao/mcd-cdp-portal)

## The official Maker dapp for managing CDPs and generating Dai

### Prerequisites

Have installed:

- [Git](https://git-scm.com/downloads)
- [Node](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/)

### Installation

1. `git clone https://github.com/makerdao/mcd-cdp-portal.git`

2. `cd mcd-cdp-portal && yarn`

### Running the CDP Portal

- `yarn start`
- Go to http://localhost:3000

For hardware wallet support:

- `HTTPS=true yarn start`
- Go to https://localhost:3000


### Developing with a local testchain

1. Clone either [dai.js](https://github.com/makerdao/dai.js) or the [testchain](https://github.com/makerdao/testchain) repo

2. Start the testchain

      1. If using dai.js, run `yarn && git submodule update --init --recursive && yarn test:net -s mcd-step-4 --fast`

      2. If using the testchain repo directly, run `scripts/launch`

3. Navigate to `http://localhost:3000?network=test&simplePriceFeeds=1`


_see [this PR](https://github.com/makerdao/mcd-cdp-portal/pull/26) for more details_



