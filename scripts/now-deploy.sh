#!/usr/bin/env bash
set -e

./scripts/write-env-vars.sh
cat ./src/static/version.json

FROM_NAME=`now --token $NOW_TOKEN --scope mkr-js-prod`
BRANCH=`echo ${TRAVIS_BRANCH//./-} | tr '[:upper:]' '[:lower:]'`
TO_NAME=mcd-cdp-portal-git-${BRANCH}.mkr-js-prod.now.sh
now alias --token $NOW_TOKEN --scope mkr-js-prod $FROM_NAME $TO_NAME
