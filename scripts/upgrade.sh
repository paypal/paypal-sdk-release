#!/bin/sh

set -e;

if ! git diff-files --quiet; then
    echo "Can not upgrade with unstaged uncommited changes";
    exit 1;
fi;

if ! git diff-index --quiet --cached HEAD; then
    echo "Can not upgrade with staged uncommited changes";
    exit 1;
fi;

UPSTREAM='origin'
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

node $(npm bin)/check-node-version --node='>=8' --npm='>=5';

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

if [ -z "$1" ]; then
    read -r -p "Upgrade all modules? [y/N] " response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
    then
        $(npm bin)/npm-check-updates --prod --upgrade
    else
        exit 0;
    fi
else
    if ! npm ls "$1"; then
        npm install --production --save --save-exact "$1"
    fi;

    $(npm bin)/npm-check-updates --prod --upgrade --filter="$1"
fi;

npm install;
npm test;

rm package-lock.json;
rm -rf ./node_modules;
npm install --production;

npm run validate-flat;

if [ ! -f ./package-lock.json ]; then
    echo "Expected package-lock.json to be generated - are you using npm5+?"
    exit 1;
fi

git add package.json;
git add package-lock.json;

if [ -z "$1" ]; then
    git commit -m "Update version of all modules"
else
    git commit -m "Update version of $1"
fi;

git push;

rm -rf ./node_modules;
npm install;
git checkout ./package-lock.json