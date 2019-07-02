#!/usr/bin/env bash
set -e

./scripts/write-env-vars.sh
cat ./src/static/version.json

FROM_NAME=`now --token $NOW_TOKEN --scope mkr-js-prod`
TO_NAME=mcd-cdp-portal-git-${TRAVIS_BRANCH//./-}.mkr-js-prod.now.sh
now alias --token $NOW_TOKEN --scope mkr-js-prod $FROM_NAME $TO_NAME
