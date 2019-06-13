#!/usr/bin/env bash
cat > ./src/static/version.json <<- EOM
{
  "COMMIT_SHA": "${TRAVIS_COMMIT}",
  "COMMIT_BRANCH": "${TRAVIS_BRANCH}"
}
EOM
