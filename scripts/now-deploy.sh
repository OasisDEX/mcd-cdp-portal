#!/usr/bin/env bash
set -e

cat > ./src/static/version.json <<- EOM
{
  "COMMIT_SHA": "${CIRCLE_SHA1}",
  "COMMIT_BRANCH": "${CIRCLE_BRANCH}"
}
EOM

cat ./src/static/version.json

FROM_NAME=`now --token $NOW_TOKEN --scope mkr-js-prod`
BRANCH=`echo ${CIRCLE_BRANCH//./-} | tr '[:upper:]' '[:lower:]'`
TO_NAME=mcd-cdp-portal-git-${BRANCH}.mkr-js-prod.now.sh

./node_modules/.bin/now alias \
  --token $NOW_TOKEN \
  --scope mkr-js-prod \
  $FROM_NAME $TO_NAME
