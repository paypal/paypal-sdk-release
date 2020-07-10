#!/bin/bash

set -e;

if ! git diff-files --quiet; then
    echo "ERROR: Can not continue with unstaged changes";
    exit 1;
fi;

if ! git diff-index --quiet --cached HEAD; then
    echo "ERROR: Can not continue with uncommitted changes";
    exit 1;
fi;

npx check-node-version --node='>=12' --npm='>=6.14';

UPSTREAM='origin'
BRANCH=$(git rev-parse --abbrev-ref HEAD)
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM"/"$BRANCH")
BASE=$(git merge-base @ "$UPSTREAM"/"$BRANCH")

if [ $LOCAL != $REMOTE ]; then
    if [ $LOCAL = $BASE ]; then
        echo "ERROR: Local repo behind upstream"
        exit 1;
    elif [ $REMOTE = $BASE ]; then
        echo "ERROR: Local repo ahead of upstream"
        exit 1;
    else
        echo "ERROR: Local repo diverged from upstream"
        exit 1;
    fi
fi
