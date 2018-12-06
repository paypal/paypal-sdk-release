#!/bin/bash

set -e;

if ! git diff-files --quiet; then
    echo "Can not continue with unstaged uncommited changes";
    exit 1;
fi;

if ! git diff-index --quiet --cached HEAD; then
    echo "Can not continue with staged uncommited changes";
    exit 1;
fi;

rm -rf ./node_modules;
rm -rf ./package-lock.json;

$(which npm) install;

node $(npm bin)/check-node-version --node='>=8' --npm='>=5.8';

UPSTREAM='origin'
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL != $REMOTE ]; then
    if [ $LOCAL = $BASE ]; then
        echo "Local repo behind upstream"
        exit 1;
    elif [ $REMOTE = $BASE ]; then
        echo "Local repo ahead of upstream"
        exit 1;
    else
        echo "Local repo diverged from upstream"
        exit 1;
    fi
fi