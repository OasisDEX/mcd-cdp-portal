#!/usr/bin/env bash
set -e

./scripts/write-env-vars.sh
cat ./src/static/version.json

now --token $NOW_TOKEN --scope mkr-js-prod | tee now-deploy.log
FROM_NAME=`cat now-deploy.log | grep "Aliased to" | awk '{print $5}'`
TO_NAME=mcd-cdp-portal-git-${TRAVIS_BRANCH}.mkr-js-prod.now.sh
now alias --token $NOW_TOKEN --scope mkr-js-prod $FROM_NAME $TO_NAME
