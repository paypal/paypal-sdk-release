#!/bin/sh

set -e;

if ! git diff-files --quiet; then
    echo "Can not publish with unstaged uncommited changes";
    exit 1;
fi;

if ! git diff-index --quiet --cached HEAD; then
    echo "Can not publish with staged uncommited changes";
    exit 1;
fi;

if [ -z "$1" ]; then
    echo "Provide module name to update"
    exit 1;
fi;

if ! npm ls "$1"; then
    echo "Can not find module $1"
    exit 1;
fi;

npm run update-modules -- --filter="$1";
npm install;
npm test;

git add package.json;
git commit -m "Update version of $1"

npm version patch;

git push;
git push --tags;
npm publish;
